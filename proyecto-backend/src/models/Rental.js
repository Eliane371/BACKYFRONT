const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1
    },
    safetyGearQuantity: {
      helmets: {
        type: Number,
        default: 0
      },
      lifeJackets: {
        type: Number,
        default: 0
      }
    }
  }],
  startTime: {
    type: Date,
    required: [true, 'Por favor ingrese la hora de inicio']
  },
  endTime: {
    type: Date,
    required: [true, 'Por favor ingrese la hora de fin']
  },
  slots: {
    type: Number,
    required: [true, 'Por favor ingrese la cantidad de turnos'],
    min: 1,
    max: 3
  },
  totalPrice: {
    type: Number,
    required: [true, 'Por favor ingrese el precio total']
  },
  discountApplied: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'cancelado', 'completado', 'reembolso'],
    default: 'pendiente'
  },
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'tarjeta', 'pendiente'],
    default: 'pendiente'
  },
  currency: {
    type: String,
    enum: ['local', 'extranjero'],
    required: [true, 'Por favor seleccione la moneda']
  },
  cancellationTime: Date,
  isStormCancellation: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar consultas
rentalSchema.index({ user: 1 });
rentalSchema.index({ startTime: 1, endTime: 1 });

module.exports = mongoose.model('Rental', rentalSchema);