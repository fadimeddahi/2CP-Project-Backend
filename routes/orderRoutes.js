const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { checkAuth } = require('../middleware/auth');

// POST /api/orders
router.post('/', checkAuth, orderController.createOrder);

// GET /api/orders/user/:userId
router.get('/user/:userId', checkAuth, orderController.getUserOrders);

module.exports = router;