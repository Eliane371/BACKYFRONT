import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del producto es requerido']
      },
      about: {
        type: String,
        required: [true, 'La descripción es requerida'],
        minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
        maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
      },
      fees: {
        type: Number,
        required: [true, 'El precio por turno es requerido'],
        min: [0, 'El precio no puede ser negativo']
        //set: v => Math.round(v * 100) / 100 // Redondear a 2 decimales
      },
      category:{
        type:String, 
        required:true
    }, 
      requiresSafetyGear: {
        type: Boolean,
        default: function() {
          return ['JetSky', 'Cuatriciclo'].includes(this.name);
        }
      },
      safetyGear: {
        helmet: {
          type: Boolean,
          default: function() {
            return this.name === 'Cuatriciclo' || this.name === 'JetSky';
          }
        },
        lifeJacket: {
          type: Boolean,
          default: function() {
            return this.name === 'JetSky';
          }
        }
      },
      slots_booked:{type:Object,default:{}},
      maxPeople: {
        type: Number,
        required: true,
        //default: 1,
        enum: {
          values: [1, 2],
          message: 'La capacidad máxima es de 2 personas'
        },
        validate: {
          validator: function(v) {
            // Solo los equipos acuáticos permiten 2 personas
            if (v === 2) {
              return ['JetSky', 'Cuatriciclo'].includes(this.name);
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
      image: {
        type: String,
        default:true,
      }
    }, {minimize:false})
    
    
    
    
    // Validación personalizada para equipos de seguridad
    productSchema.pre('save', function(next) {
      if (this.name === 'JetSky' && !this.safetyGear.lifeJacket) {
        throw new Error('Los JetSkys requieren chalecos salvavidas');
      }
      if (this.name === 'Cuatriciclo' && !this.safetyGear.helmet) {
        throw new Error('Los Cuatriciclos requieren cascos');
      }
      if (this.name === 'JetSky' && !this.safetyGear.helmet) {
        throw new Error('Los JetSkys requieren cascos');
      }
      next();
    /*name:{type:String, required:true},
    about:{type:String, required:true},
    category:{type:String, required:true},  
    image:{type:String, required:true},
    fee:{type:Number, required:true},
    available:{type:Boolean, default:true},
    date:{type:Number, required:true},
    slots_booked:{type:Object,default:{}}*/
})/*{minimize:false})*/

const productModel = mongoose.models.product || mongoose.model('product', productSchema)

export default productModel;