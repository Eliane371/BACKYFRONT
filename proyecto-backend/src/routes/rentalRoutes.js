const express = require('express');
const router = express.Router();
const {
  createRental,
  getMyRentals,
  cancelRental
} = require('../controllers/rentalController');
const { protect } = require('../middlewares/auth');

router.route('/').post(protect, createRental);
router.route('/myrentals').get(protect, getMyRentals);
router.route('/:id/cancel').put(protect, cancelRental);

module.exports = router;