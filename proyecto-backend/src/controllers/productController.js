const Product = require('../models/Product');
const asyncHandler = require('express-async-handler');

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Público
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
});

// @desc    Crear un producto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, pricePerSlot, requiresSafetyGear, maxPeople } = req.body;

  const product = new Product({
    name,
    description,
    pricePerSlot,
    requiresSafetyGear,
    maxPeople,
    user: req.user._id
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

module.exports = {
  getProducts,
  getProductById,
  createProduct
};