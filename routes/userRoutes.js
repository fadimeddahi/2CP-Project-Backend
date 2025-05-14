const express = require('express');
const { body } = require('express-validator');
const { protect, restrictTo } = require('../middlewares/auth'); // Importez les middlewares nécessaires
const userController = require('../controllers/userController'); // Assurez-vous que le chemin est correct

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

// GET /api/users/:id - Récupérer un utilisateur par ID (protégé, réservé aux administrateurs)
router.get('/:id', protect, restrictTo('admin'), userController.getUserById);

module.exports = router;