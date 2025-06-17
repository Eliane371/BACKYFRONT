import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on('connected',()=> console.log("Base de Datos Conectada"))
    await mongoose.connect(`${process.env.MONGODB_URI}/beachrent`)
}

export default connectDB;