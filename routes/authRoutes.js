const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const { protect, restrictTo } = require('../middlewares/auth.js');
const validators = require('../validators/auth.js');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: 'Trop de tentatives, veuillez réessayer plus tard',
});

// Public Routes
router.post('/register', authLimiter, validators.validateRegister, authController.register);
router.post('/login', authLimiter, validators.validateLogin, authController.login);
router.post('/forgot-password', validators.validateForgotPassword, authController.forgotPassword);
router.patch('/reset-password/:token', validators.validateResetPassword, authController.resetPassword);

// Protected Routes
router.use(protect);

router.patch('/update-profile', validators.validateUpdateProfile, authController.updateProfile);
router.get('/logout', (req, res) => {
  res.status(200).json({ status: 'success', message: 'Déconnecté' });
});

// Admin-only Routes
router.use(restrictTo('admin'));

router.patch('/subscribe', authController.subscribe);
router.get('/all-users', authController.getAllUsers);
router.get('/user/:id', authController.getUserById);
router.patch('/subscribe', authController.subscribe);
module.exports = router;