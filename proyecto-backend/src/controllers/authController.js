const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Autenticar usuario (login)
// @route   POST /api/auth
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    res.status(400);
    throw new Error('Por favor ingrese email y contraseña');
  }

  // Buscar usuario
  const user = await User.findOne({ email });

  // Verificar usuario y contraseña
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Credenciales inválidas');
  }
});

// @desc    Registrar nuevo usuario (signup)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validaciones básicas
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Complete todos los campos requeridos');
  }

  // Verificar si usuario existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('El email ya está registrado');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Crear usuario
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
    role: 'user' // Rol por defecto
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario no válidos');
  }
});

// @desc    Obtener datos del usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user se establece en el middleware de autenticación
  const user = await User.findById(req.user.id).select('-password');
  
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  res.status(200).json({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role
  });
});

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = {
  login,
  register,
  getMe
};