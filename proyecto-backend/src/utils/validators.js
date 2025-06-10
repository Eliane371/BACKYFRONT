const { body } = require('express-validator');
const User = require('../models/User');

exports.validateUpdateUser = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),

  body('email')
    .optional()
    .isEmail().withMessage('Ingrese un email válido')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new Error('El email ya está en uso');
      }
      return true;
    }),

  body('phone')
    .optional()
    .isMobilePhone().withMessage('Ingrese un número de teléfono válido'),

  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
];