const Rental = require('../models/Rental');
const Product = require('../models/Product');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const { calculateEndTime, checkAvailability } = require('../utils/helpers');
const { sendRentalConfirmation, sendStormCancellation } = require('../services/emailService');
const { processPayment, processRefund } = require('../services/paymentService');

// @desc    Crear nueva reserva
// @route   POST /api/rentals
// @access  Privado
const createRental = asyncHandler(async (req, res) => {
  const { productIds, startTime, slots, paymentMethodId, currency = 'USD' } = req.body;
  const userId = req.user._id;

  // Validación básica
  if (!productIds || !startTime || !slots || !currency) {
    res.status(400);
    throw new Error('Faltan campos requeridos: productIds, startTime, slots, currency');
  }

  // Validación de fechas
  const now = new Date();
  const reservationTime = new Date(startTime);
  
  if (reservationTime < now) {
    res.status(400);
    throw new Error('No se pueden reservar turnos en el pasado');
  }

  const diffHours = (reservationTime - now) / (1000 * 60 * 60);
  
  // Validar anticipación máxima (48 horas)
  if (diffHours > 48) {
    res.status(400);
    throw new Error('La reserva máxima es con 48 horas de anticipación');
  }

  // Validar slots (1-3)
  if (slots < 1 || slots > 3) {
    res.status(400);
    throw new Error('Se pueden reservar de 1 a 3 turnos consecutivos');
  }

  // Calcular hora de fin (30 minutos por slot)
  const endTime = calculateEndTime(reservationTime, slots);

  // Obtener y validar productos
  const products = await Product.find({ _id: { $in: productIds } });
  
  if (products.length !== productIds.length) {
    res.status(400);
    throw new Error('Uno o más productos no existen');
  }

  // Verificar disponibilidad
  const isAvailable = await checkAvailability(productIds, reservationTime, endTime);
  if (!isAvailable) {
    res.status(400);
    throw new Error('Los productos no están disponibles en el horario solicitado');
  }

  // Calcular precio total y descuentos
  let total = products.reduce((sum, product) => sum + (product.pricePerSlot * slots), 0);
  let discount = 0;
  
  // Aplicar descuento del 10% por múltiples productos
  if (products.length > 1) {
    discount = total * 0.1;
    total -= discount;
  }

  // Preparar productos con equipos de seguridad
  const rentalProducts = products.map(product => {
    const rentalProduct = {
      product: product._id,
      name: product.name,
      quantity: 1,
      safetyGearQuantity: {
        helmets: 0,
        lifeJackets: 0
      }
    };

    // Asignar equipos de seguridad según producto
    if (['JetSky', 'Cuatriciclos'].includes(product.name)) {
      rentalProduct.safetyGearQuantity.helmets = product.maxPeople;
      if (product.name === 'JetSky') {
        rentalProduct.safetyGearQuantity.lifeJackets = product.maxPeople;
      }
    }

    return rentalProduct;
  });

  // Crear objeto de reserva
  const rental = new Rental({
    user: userId,
    products: rentalProducts,
    startTime: reservationTime,
    endTime,
    slots,
    totalPrice: total,
    originalPrice: total + discount,
    discountApplied: discount,
    currency,
    status: 'pendiente'
  });

  try {
    // Procesar pago según método
    if (paymentMethodId) {
      // Pago con tarjeta (Stripe)
      const paymentResult = await processPayment(paymentMethodId, rental, currency);
      rental.paymentStatus = 'completado';
      rental.paymentMethod = 'tarjeta';
      rental.paymentDetails = paymentResult;
      rental.status = 'confirmado';
    } else {
      // Pago en efectivo
      rental.paymentStatus = 'pendiente';
      rental.paymentMethod = 'efectivo';
    }

    const createdRental = await rental.save();
    
    // Enviar email de confirmación
    try {
      const user = await User.findById(userId);
      await sendRentalConfirmation(user, createdRental, currency);
    } catch (emailError) {
      console.error('Error enviando email de confirmación:', emailError);
    }

    res.status(201).json({
      success: true,
      data: createdRental
    });
  } catch (paymentError) {
    console.error('Error procesando pago:', paymentError);
    res.status(400);
    throw new Error(`Error en el pago: ${paymentError.message}`);
  }
});

// @desc    Obtener reservas del usuario
// @route   GET /api/rentals/myrentals
// @access  Privado
const getMyRentals = asyncHandler(async (req, res) => {
  const rentals = await Rental.find({ user: req.user._id })
    .populate('products.product', 'name pricePerSlot imageUrl maxPeople')
    .sort({ startTime: -1 });

  res.json({
    success: true,
    count: rentals.length,
    data: rentals
  });
});

// @desc    Cancelar reserva normal
// @route   PUT /api/rentals/:id/cancel
// @access  Privado
const cancelRental = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('user', 'email name');

  if (!rental) {
    res.status(404);
    throw new Error('Reserva no encontrada');
  }

  // Verificar propiedad de la reserva
  if (rental.user._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('No autorizado para cancelar esta reserva');
  }

  // Validar estados cancelables
  const cancelableStatuses = ['pendiente', 'confirmado'];
  if (!cancelableStatuses.includes(rental.status)) {
    res.status(400);
    throw new Error(`No se puede cancelar una reserva en estado: ${rental.status}`);
  }

  // Validar tiempo de cancelación (2 horas mínimo)
  const now = new Date();
  const diffHours = (rental.startTime - now) / (1000 * 60 * 60);
  
  if (diffHours < 2) {
    res.status(400);
    throw new Error('Cancelación permitida hasta 2 horas antes del turno');
  }

  // Actualizar reserva (sin reembolso automático según consigna)
  rental.status = 'cancelado';
  rental.cancellationTime = now;
  await rental.save();

  res.json({ 
    success: true,
    message: 'Reserva cancelada exitosamente',
    data: {
      id: rental._id,
      status: rental.status,
      cancellationTime: rental.cancellationTime
    }
  });
});

// @desc    Cancelación por tormenta (admin only) - CON REEMBOLSO DEL 50%
// @route   PUT /api/rentals/:id/cancel-storm
// @access  Privado/Admin
const cancelDueToStorm = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id)
    .populate('user', 'email name');

  if (!rental) {
    res.status(404);
    throw new Error('Reserva no encontrada');
  }

  // Validar que la reserva no haya comenzado
  if (new Date() > rental.startTime) {
    res.status(400);
    throw new Error('No se puede cancelar por tormenta una reserva ya iniciada');
  }

  // Solo reservas confirmadas (con pago completado)
  if (rental.status !== 'confirmado' || rental.paymentStatus !== 'completado') {
    res.status(400);
    throw new Error('Solo se puede cancelar reservas confirmadas y pagas');
  }

  // Procesar reembolso del 50%
  let refundResult = null;
  try {
    refundResult = await processRefund(rental, 0.5); // 50% de reembolso
  } catch (refundError) {
    console.error('Error en reembolso por tormenta:', refundError);
    throw new Error('Error al procesar el reembolso');
  }

  // Marcar como cancelado por tormenta
  rental.status = 'cancelado_tormenta';
  rental.cancellationTime = new Date();
  rental.isStormCancellation = true;
  rental.refundDetails = refundResult;
  await rental.save();

  // Enviar notificación al usuario
  try {
    await sendStormCancellation(rental.user, rental, refundResult.amount);
  } catch (emailError) {
    console.error('Error enviando email de cancelación:', emailError);
  }

  res.json({
    success: true,
    message: 'Reserva cancelada por condiciones climáticas (50% reembolsado)',
    data: {
      refund: refundResult,
      reservationId: rental._id
    }
  });
});

module.exports = {
  createRental,
  getMyRentals,
  cancelRental,
  cancelDueToStorm
};