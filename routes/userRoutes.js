const express = require('express');
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middlewares/auth'); // Importez les middlewares nécessaires
const userController = require('../controllers/userController'); // Assurez-vous que le chemin est correct
const upload = require('../utils/uploadFile');

const router = express.Router();

// POST /api/users/register - Inscription d'un utilisateur
router.post(
  '/register',
  [
    body('firstName').notEmpty().withMessage('Le prénom est obligatoire'),
    body('lastName').notEmpty().withMessage('Le nom est obligatoire'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  ],
  userController.registerUser 
);

// POST /api/users/login - Connexion d'un utilisateur
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Le mot de passe est requis'),
  ],
  userController.login // Vérifiez que cette fonction est définie dans userController.js
);

// GET /api/users - Récupérer tous les utilisateurs (protégé, réservé aux administrateurs)
router.get('/', protect, restrictTo('admin'), userController.getAllUsers);

// First define specific routes
router.get('/coaches', userController.getCoaches);

// Then define parameter-based routes
router.get('/:id', protect, restrictTo('admin'), userController.getUserById);

// Add this new route for uploading user photos
router.patch('/:id/photo',
  protect,
  upload.single('photo'),
  userController.uploadUserPhoto
);

module.exports = router;