const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    enum: {
      values: ['JetSky', 'Cuatriciclos', 'Equipo de buceo', 'Tabla de surf adultos', 'Tabla de surf niños'],
      message: '{VALUE} no es un producto válido'
    },
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
    maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
  },
  pricePerSlot: {
    type: Number,
    required: [true, 'El precio por turno es requerido'],
    min: [0, 'El precio no puede ser negativo'],
    set: v => Math.round(v * 100) / 100 // Redondear a 2 decimales
  },
  requiresSafetyGear: {
    type: Boolean,
    default: function() {
      return ['JetSky', 'Cuatriciclos'].includes(this.name);
    }
  },
  safetyGear: {
    helmet: {
      type: Boolean,
      default: function() {
        return this.name === 'Cuatriciclos' || this.name === 'JetSky';
      }
    },
    lifeJacket: {
      type: Boolean,
      default: function() {
        return this.name === 'JetSky';
      }
    }
  },
  maxPeople: {
    type: Number,
    required: true,
    default: 1,
    enum: {
      values: [1, 2],
      message: 'La capacidad máxima debe ser 1 o 2 personas'
    },
    validate: {
      validator: function(v) {
        // Solo los equipos acuáticos permiten 2 personas
        if (v === 2) {
          return ['JetSky', 'Cuatriciclos'].includes(this.name);
        }
        return true;
      },
      message: 'Solo JetSkys y Cuatriciclos permiten 2 personas'
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: 'default-product.jpg',
    validate: {
      validator: validator.isURL,
      message: 'La URL de la imagen no es válida'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Actualizar marca de tiempo al modificar
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Índices para mejor rendimiento
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ requiresSafetyGear: 1 });
productSchema.index({ available: 1 });

// Validación personalizada para equipos de seguridad
productSchema.pre('save', function(next) {
  if (this.name === 'JetSky' && !this.safetyGear.lifeJacket) {
    throw new Error('Los JetSkys requieren chalecos salvavidas');
  }
  if (this.name === 'Cuatriciclos' && !this.safetyGear.helmet) {
    throw new Error('Los Cuatriciclos requieren cascos');
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;