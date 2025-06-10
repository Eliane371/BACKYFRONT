const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./src/config/database');
const Agenda = require('agenda');
const { sendStormCancellation } = require('./src/services/emailService');

// 1. Configuración inicial
dotenv.config({ path: path.resolve(__dirname, '.env') });

// 2. Inicializar Express
const app = express();

// 3. Configuración de Agenda para tareas programadas
const agenda = new Agenda({
  db: { address: process.env.MONGODB_URI, collection: 'scheduledJobs' },
  defaultConcurrency: 1
});

// 4. Middlewares esenciales
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Logging en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 6. Tarea programada: Liberar reservas no pagadas en efectivo
agenda.define('liberar-reservas-pendientes', async (job) => {
  try {
    const twoHoursBeforeNow = new Date(Date.now() - 2 * 60 * 60 * 1000);
    
    const result = await Rental.updateMany(
      { 
        paymentMethod: 'efectivo',
        paymentStatus: 'pendiente',
        startTime: { $lte: twoHoursBeforeNow },
        status: { $in: ['pendiente', 'confirmado'] }
      },
      { $set: { status: 'liberado' } }
    );
    
    console.log(`Reservas liberadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error('Error en liberación automática:', error);
  }
});

// 7. Tarea programada: Verificar tormentas
agenda.define('verificar-tormentas', async (job) => {
  // Aquí iría la integración con un servicio meteorológico
  // Por ahora es un placeholder para la funcionalidad
  console.log('Verificación de condiciones climáticas ejecutada');
});

// 8. Conexión a DB e inicio de tareas programadas
const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    console.log(' MongoDB conectado');

    // Iniciar Agenda
    await agenda.start();
    
    // Programar tareas recurrentes
    agenda.every('30 minutes', 'liberar-reservas-pendientes');
    agenda.every('1 hour', 'verificar-tormentas');
    console.log(' Tareas programadas iniciadas');

    // 9. Rutas principales
    app.use('/api/products', require('./src/routes/productRoutes'));
    app.use('/api/rentals', require('./src/routes/rentalRoutes'));
    app.use('/api/users', require('./src/routes/userRoutes'));
    app.use('/api/auth', require('./src/routes/authRoutes'));

    // 10. Endpoint de estado
    app.get('/api/status', (req, res) => {
      res.status(200).json({
        status: 'active',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected',
          scheduler: 'running'
        }
      });
    });

    // 11. Manejo de errores (debe ser el último middleware)
    const { errorHandler } = require('./src/middlewares/errorHandler');
    app.use(errorHandler);

    // 12. Iniciar servidor
    const PORT = process.env.PORT || 3000;
    const server = app.listen(PORT, () => {
      console.log('Servidor en modo ${process.env.NODE_ENV} en puerto ${PORT}');
    });

    // 13. Manejo de errores no capturados
    process.on('unhandledRejection', (err) => {
      console.error(' Error no capturado:', err);
      server.close(() => process.exit(1));
    });

    process.on('SIGTERM', () => {
      console.log(' SIGTERM recibido. Cerrando servidor...');
      server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Error crítico al iniciar:', error);
    process.exit(1);
  }
};

// 14. Iniciar la aplicación
startServer();