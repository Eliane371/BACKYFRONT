const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  updateUserRole
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/auth');
const { validateUpdateUser } = require('../utils/validators');

// @desc    Obtener todos los usuarios (Admin)
// @route   GET /api/users
// @access  Private/Admin
router.route('/')
  .get(protect, admin, getUsers);

// @desc    Obtener usuario por ID (Admin)
// @route   GET /api/users/:id
// @access  Private/Admin
router.route('/:id')
  .get(protect, admin, getUserById);

// @desc    Actualizar perfil de usuario
// @route   PUT /api/users/profile
// @access  Private
router.route('/profile')
  .put(protect, validateUpdateUser, updateUserProfile);

// @desc    Eliminar usuario (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.route('/:id')
  .delete(protect, admin, deleteUser);

// @desc    Actualizar rol de usuario (Admin)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
router.route('/:id/role')
  .put(protect, admin, updateUserRole);

module.exports = router;