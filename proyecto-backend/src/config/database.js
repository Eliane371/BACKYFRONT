const mongoose = require('mongoose');
const express = require("express");
const cors = require("cors");

// Configuración de la conexión a MongoDB
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true, 
        useUnifiedTopology: true
      });
      console.log('MongoDB Atlas conectado correctamente');
    
  } catch (error) {
    console.error('Error de conexión a MongoDB Atlas:', error.message);
    process.exit(1);
  }
};
module.exports = connectDB;