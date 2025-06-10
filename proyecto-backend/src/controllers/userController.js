const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const validator = require('validator');

// @desc    Registrar nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validaciones
  if (!name || !email || !password || !phone) {
    res.status(400);
    throw new Error('Por favor complete todos los campos');
  }

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Email no válido');
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error('La contraseña debe tener al menos 8 caracteres');
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
    phone
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } else {
    res.status(400);
    throw new Error('Datos de usuario no válidos');
  }
});

// @desc    Autenticar usuario
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    res.status(400);
    throw new Error('Por favor ingrese email y contraseña');
  }

  // Verificar usuario
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } else {
    res.status(401);
    throw new Error('Credenciales inválidas');
  }
});

// @desc    Obtener datos del usuario actual
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  // req.user se establece en el middleware auth
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }

  res.status(200).json(user);
});

// @desc    Actualizar perfil de usuario
// @route   PUT /api/auth/me
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    // Solo actualizar email si es diferente y no existe
    if (req.body.email && req.body.email !== user.email) {
      if (await User.findOne({ email: req.body.email })) {
        res.status(400);
        throw new Error('El email ya está en uso');
      }
      user.email = req.body.email;
    }

    // Actualizar contraseña si se proporciona
    if (req.body.password) {
      if (req.body.password.length < 8) {
        res.status(400);
        throw new Error('La contraseña debe tener al menos 8 caracteres');
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id)
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateUser
};