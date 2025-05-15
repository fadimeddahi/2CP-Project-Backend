const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/uploadFile');
const { protect, restrictTo } = require('../middlewares/auth');

// GET /api/products?category=protein
router.get('/', productController.getProductsByCategory);

// POST /api/products (Admin only)
router.post('/', productController.createProduct);

// POST /api/products/:id/image
router.post('/:id/image', 
  protect, 
  restrictTo('admin'),
  upload.single('image'), // Single image
  productController.uploadProductImage
);

// PATCH /api/products/:productId
router.patch('/:productId', 
  protect, 
  restrictTo('admin'),
  productController.updateProduct
);

// PATCH /api/products/:id/image (for updating image)
router.patch('/:id/image',
  protect,
  restrictTo('admin'),
  upload.single('image'), // Single image
  productController.uploadProductImage
);

module.exports = router;