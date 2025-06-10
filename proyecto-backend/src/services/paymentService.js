const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Rental = require('../models/Rental');
//const { convertCurrency } = require('./currencyService');

// @desc    Procesar pago de reserva
// @route   (Interno)
// @params  paymentMethodId, rental, currency
const processPayment = async (paymentMethodId, rental, currency = 'USD') => {
  try {
    // Validación básica
    if (!paymentMethodId || !rental || !currency) {
      throw new Error('Datos incompletos para procesar el pago');
    }

    // Conversión de moneda si es necesario
    let amount;
    if (currency === 'USD') {
      amount = Math.round(rental.totalPrice * 100); // Stripe usa centavos
    } else {
      const convertedAmount = await convertCurrency(rental.totalPrice, 'USD', currency);
      amount = Math.round(convertedAmount);
    }

    // Crear intento de pago en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      payment_method: paymentMethodId,
      confirm: true,
      description: `Reserva #${rental._id}`,
      metadata: {
        rentalId: rental._id.toString(),
        userId: rental.user.toString(),
        products: rental.products.map(p => p.name).join(', ')
      },
      receipt_email: rental.user.email // Requiere cargar el usuario con populate
    });

    // Estructurar respuesta
    const paymentResult = {
      paymentId: paymentIntent.id,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: paymentIntent.created,
      receiptUrl: paymentIntent.charges.data[0].receipt_url
    };

    return {
      success: true,
      ...paymentResult
    };

  } catch (error) {
    console.error('Error en processPayment:', error);
    throw new Error(`Error procesando pago: ${error.message}`);
  }
};

// @desc    Procesar reembolso (específico para tormentas)
// @route   (Interno)
// @params  rental, refundPercentage (0.5 para 50% en tormentas)
const processRefund = async (rental, refundPercentage = 0.5) => {
  try {
    // Validar datos necesarios
    if (!rental.paymentDetails?.paymentId) {
      throw new Error('No hay información de pago para reembolsar');
    }

    if (refundPercentage <= 0 || refundPercentage > 1) {
      throw new Error('Porcentaje de reembolso inválido');
    }

    // Calcular monto a reembolsar (en centavos)
    const refundAmount = Math.round(
      rental.paymentDetails.amount * 100 * refundPercentage
    );

    // Crear reembolso en Stripe
    const refund = await stripe.refunds.create({
      payment_intent: rental.paymentDetails.paymentId,
      amount: refundAmount,
      reason: refundPercentage === 0.5 ? 'requested_by_customer' : 'duplicate',
      metadata: {
        originalPayment: rental.paymentDetails.paymentId,
        refundPercentage: `${refundPercentage * 100}%`,
        reason: refundPercentage === 0.5 ? 'storm_cancellation' : 'standard_refund'
      }
    });

    // Estructurar respuesta
    const refundResult = {
      refundId: refund.id,
      amount: refund.amount / 100,
      currency: rental.paymentDetails.currency,
      percentage: refundPercentage * 100,
      status: refund.status
    };

    return {
      success: true,
      ...refundResult
    };

  } catch (error) {
    console.error('Error en processRefund:', error);
    throw new Error(`Error procesando reembolso: ${error.message}`);
  }
};

// @desc    Registrar pago en efectivo
// @route   (Interno)
const processCashPayment = async (rental) => {
  try {
    // Validación básica
    if (!rental) {
      throw new Error('Datos de reserva faltantes');
    }

    // Simplemente marcamos como pendiente (la validación de tiempo se hace en el controller)
    return {
      success: true,
      paymentMethod: 'cash',
      status: 'pending_verification',
      dueTime: rental.startTime
    };

  } catch (error) {
    console.error('Error en processCashPayment:', error);
    throw new Error(`Error registrando pago en efectivo: ${error.message}`);
  }
};

// @desc    Conversión de moneda (simulada)
// @route   (Interno)
const convertCurrency = async (amount, from, to) => {
  // En producción, integrar con API real como Fixer o ExchangeRate-API
  const rates = {
    'USD:local': 3.68, // Ejemplo: 1 USD = 3.68 soles (moneda oeruana)
    'local:USD': 0.27,
    'USD:EUR': 0.85,
    'EUR:USD': 1.18
  };

  if (from === to) return amount;
  
  const rateKey = `${from}:${to}`;
  if (!rates[rateKey]) {
    throw new Error(`Tipo de cambio no soportado: ${from} a ${to}`);
  }

  return amount * rates[rateKey];
};

module.exports = {
  processPayment,
  processRefund,
  processCashPayment,
  convertCurrency
};