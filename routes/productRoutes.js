const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/products?category=protein
router.get('/', productController.getProductsByCategory);

// POST /api/products (Admin only)
router.post('/', productController.createProduct);

module.exports = router;