const errorHandler = (err, req, res, next) => {
    // Log del error para desarrollo
    console.error(`Error: ${err.message}`.red);
    console.error(err.stack);
  
    // Respuesta basada en el tipo de error
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Error interno del servidor';
    let errorDetails = null;
  
    // Manejo específico de errores de Mongoose
    if (err.name === 'CastError') {
      statusCode = 400;
      message = `Recurso no encontrado. ID inválido: ${err.value}`;
    }
  
    // Validación de Mongoose
    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Error de validación';
      errorDetails = Object.values(err.errors).map(val => val.message);
    }
  
    // Error de duplicados (unique constraint)
    if (err.code === 11000) {
      statusCode = 409;
      const field = Object.keys(err.keyValue)[0];
      message = `El ${field} ya está registrado`;
    }
  
    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      statusCode = 401;
      message = 'Token no válido';
    }
  
    if (err.name === 'TokenExpiredError') {
      statusCode = 401;
      message = 'Token expirado';
    }
  
    // Respuesta de error estructurada
    res.status(statusCode).json({
      success: false,
      error: {
        code: statusCode,
        message: message,
        details: errorDetails,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }
    });
  };
  
  module.exports = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message });
  };