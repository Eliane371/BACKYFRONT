const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { convertCurrency } = require('./paymentService');
const Rental = require('../models/Rental');
const User = require('../models/User');

// Configuración del transporter (mejorada para producción)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production'
  }
});

// Renderizar plantilla 
const renderTemplate = async (template, data) => {
  try {
    const templatePath = path.join(__dirname, '../templates/emails', `${template}.ejs`);
    return await ejs.renderFile(templatePath, data);
  } catch (error) {
    console.error('Error renderizando plantilla:', error);
    throw error;
  }
};

// @desc    Enviar confirmación de reserva
const sendRentalConfirmation = async (user, rental, currency = 'USD') => {
  try {
    // Convertir montos a la moneda deseada
    let displayAmount = rental.totalPrice;
    let displayCurrency = currency;
    
    if (currency !== rental.currency) {
      displayAmount = await convertCurrency(rental.totalPrice, rental.currency, currency);
      displayAmount = Math.round(displayAmount * 100) / 100;
    }

    const productsWithSafetyGear = rental.products.map(product => {
      return {
        ...product,
        requiresSafety: ['JetSky', 'Cuatriciclos'].includes(product.name)
      };
    });

    const html = await renderTemplate('rentalConfirmation', {
      user,
      rental: {
        ...rental.toObject(),
        displayAmount,
        displayCurrency,
        products: productsWithSafetyGear
      },
      appName: 'Proyecto Backend',
      supportEmail: 'soporte@gmail.com',
      currentYear: new Date().getFullYear()
    });

    await transporter.sendMail({
      from: `"Proyecto Backend" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Confirmación de reserva #${rental._id.toString().slice(-6)}`,
      html,
      attachments: [{
        filename: 'logo.png',
        path: path.join(__dirname, '../public/images/logo.png'),
        cid: 'logo'
      }]
    });

  } catch (error) {
    console.error('Error enviando confirmación de reserva:', error);
    throw error;
  }
};

// @desc    Enviar notificación de cancelación por tormenta
const sendStormCancellation = async (user, rental, refundAmount) => {
  try {
    const html = await renderTemplate('stormCancellation', {
      user,
      rental,
      refundAmount,
      refundPercentage: 50,
      appName: 'Proyecto Backend',
      supportEmail: 'soporte@gmail.com',
      currentYear: new Date().getFullYear()
    });

    await transporter.sendMail({
      from: `"Proyecto Backend" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Cancelación por condiciones climáticas',
      html,
      attachments: [{
        filename: 'logo.png',
        path: path.join(__dirname, '../public/images/logo.png'),
        cid: 'logo'
      }]
    });

  } catch (error) {
    console.error('Error enviando notificación de tormenta:', error);
    throw error;
  }
};

// @desc    Enviar notificación de liberación de reserva
const sendReservationReleased = async (user, rental) => {
  try {
    const html = await renderTemplate('reservationReleased', {
      user,
      rental,
      appName: 'Proyecto Backend',
      currentYear: new Date().getFullYear()
    });

    await transporter.sendMail({
      from: `"Proyecto Backend" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Reserva #${rental._id.toString().slice(-6)} liberada`,
      html
    });

  } catch (error) {
    console.error('Error enviando notificación de liberación:', error);
    throw error;
  }
};

module.exports = {
  sendRentalConfirmation,
  sendStormCancellation,
  sendReservationReleased
};