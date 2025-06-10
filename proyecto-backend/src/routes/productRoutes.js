const express = require('express');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/auth');

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id')
  .put(protect, admin, productController.updateProduct) // Añadir 'admin'
  .delete(protect, admin, productController.deleteProduct);

module.exports = router;