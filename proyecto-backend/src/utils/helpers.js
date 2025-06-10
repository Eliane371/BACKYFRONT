const Rental = require('../models/Rental');

// Calcular hora de fin basada en slots (30 minutos por slot)
const calculateEndTime = (startTime, slots) => {
  const endTime = new Date(startTime);
  endTime.setMinutes(endTime.getMinutes() + (30 * slots)); // Exactamente 30 min por slot
  return endTime;
};

// Verificar disponibilidad de productos en un rango de tiempo
const checkAvailability = async (productIds, startTime, endTime) => {
  const overlappingRentals = await Rental.find({
    'products.product': { $in: productIds },
    $or: [
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      { startTime: { $gte: startTime, $lt: endTime } }
    ],
    status: { $in: ['pending', 'confirmed'] }
  });

  return overlappingRentals.length === 0;
};

module.exports = {
  calculateEndTime,
  checkAvailability
};