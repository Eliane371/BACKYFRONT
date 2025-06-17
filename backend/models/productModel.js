/*import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    category:{type:String, required:true},  
    image:{type:String, required:true},
    fee:{type:Number, required:true},
    available:{type:Boolean, required:true},
    date:{type:Number, required:true},
    slots_booked:{type:Object,default:{}}
},{minimize:false})

const productModel = mongoose.model.product || mongoose.model('product', productSchema)

export default productModel
*/