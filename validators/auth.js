const { check } = require('express-validator');

exports.validateRegister = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  check('firstName')
    .notEmpty()
    .withMessage('Le prénom est requis')
    .trim(),
  check('lastName')
    .notEmpty()
    .withMessage('Le nom est requis')
    .trim()
];

exports.validateLogin = [
  check('email').isEmail().withMessage('Email invalide'),
  check('password').exists().withMessage('Mot de passe requis')
];

exports.validateForgotPassword = [
  check('email').isEmail().withMessage('Email invalide')
];

exports.validateResetPassword = [
  check('password')
    .isLength({ min: 8 })
    .withMessage('Le mot de passe doit contenir au moins 8 caractères')
];

exports.validateUpdateProfile = [
  check('firstName').optional().trim(),
  check('lastName').optional().trim(),
  check('phone').optional().isMobilePhone().withMessage('Numéro de téléphone invalide'),
  check('gender').optional().isIn(['homme', 'femme', 'autre']),
  check('photo').optional(),
  check('gym').optional(),
  check('subscription').optional().isIn(['basic', 'premium', 'vip'])
];

