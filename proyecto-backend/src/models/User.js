const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingrese su nombre'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor ingrese su email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor ingrese un email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor ingrese una contraseña (min: 8 caracteres)'],
    minlength: 8,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Por favor ingrese su teléfono']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);