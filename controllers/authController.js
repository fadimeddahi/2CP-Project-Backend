const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/emailSender.js');

// Utility function to generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Inscription
const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      status: 'success',
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Connexion
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'error',
        message: 'Email ou mot de passe incorrect',
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      status: 'success',
      token,
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Mise à jour du profil
const updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'gender', 'photo', 'gym', 'subscription'];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password -passwordResetToken -passwordResetExpires');

    res.status(200).json({
      status: 'success',
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Échec de la mise à jour du profil',
      error: err.message,
    });
  }
};

// Mot de passe oublié
const forgotPassword = async (req, res) => {
  try {
    // 1) Get user based on email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Aucun utilisateur avec cet email'
      });
    }

    // 2) Generate random reset token
    // CORRECT: Call the createPasswordResetToken method
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    
    // 3) Send email with the token
    const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    const message = `Vous avez oublié votre mot de passe? Soumettre une requête PATCH avec votre nouveau mot de passe à: ${resetURL}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Réinitialisation de votre mot de passe',
        message
      });

      res.status(200).json({
        status: 'success',
        message: 'Token envoyé par email'
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        status: 'error',
        message: 'Erreur lors de l\'envoi de l\'email',
        error: err.message
      });
    }
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue',
      error: err.message
    });
  }
};

// Réinitialisation mot de passe
const resetPassword = async (req, res) => {
  try {
    // 1) Get user based on token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Token invalide ou expiré'
      });
    }

    // 3) Update password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 4) Log the user in, send JWT
    const token = generateToken(user._id, user.role);
    
    res.status(200).json({
      status: 'success',
      token,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Une erreur est survenue',
      error: err.message
    });
  }
};

// Souscription
const subscribe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        gym: req.body.gymId,
        subscription: req.body.plan,
        subscriptionDate: Date.now(),
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: 'Échec de la souscription',
      error: err.message,
    });
  }
};

// Déconnexion
const logout = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Déconnecté avec succès',
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la déconnexion',
      error: err.message,
    });
  }
};

// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Récupérer un utilisateur par ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Utilisateur non trouvé',
      });
    }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  updateProfile,
  forgotPassword,
  resetPassword,
  subscribe,
  getAllUsers,
  getUserById,
};