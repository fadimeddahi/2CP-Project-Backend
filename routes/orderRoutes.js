const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, checkAuth } = require('../middlewares/auth');

// POST /api/orders
router.post('/', protect, orderController.createOrder);
router.get('/user/:userId', protect, orderController.getUserOrders);
router.delete('/:orderId', protect, orderController.deleteOrder);
router.patch('/:orderId', protect, orderController.updateOrder);

module.exports = router;