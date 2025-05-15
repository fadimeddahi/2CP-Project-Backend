const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Récupérer tous les utilisateurs (Admin uniquement)
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès interdit : vous n\'êtes pas administrateur.' });
    }
    const users = await User.find().select('-password'); // Exclut le mot de passe des résultats
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Récupérer un utilisateur par ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour un utilisateur
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Retourne l'utilisateur mis à jour et applique les validateurs
    ).select('-password'); // Exclut le mot de passe
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé.' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Inscription d'un utilisateur
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    
    // Vérifiez si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Cet email est déjà utilisé.' });
    }

    // Créez un nouvel utilisateur (allow role to be specified)
    const user = await User.create({ firstName, lastName, email, password, role });

    // Génération d'un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifie si l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    // Recherche l'utilisateur par email et inclut le mot de passe
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
    }

    // Génère un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({
      status: 'success',
      token,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          role: user.role,
        },
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Route de test pour vérifier un utilisateur
exports.test = async (req, res) => {
  try {
    const user = await User.findOne();
    if (!user) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé.' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};

// Add this new controller function
exports.getCoaches = async (req, res) => {
  try {
    const coaches = await User.find({ 
      $or: [
        { role: 'coach' },
        { status: 'coach' }
      ]
    }).select('-password');
    
    res.status(200).json({
      status: 'success',
      results: coaches.length,
      data: coaches
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this new controller function
exports.uploadUserPhoto = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
    
    // Generate file URL
    const photoUrl = `${req.protocol}://${req.get('host')}/uploads/users/${req.file.filename}`;
    
    // Update user with new photo URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { photo: photoUrl },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      status: 'success',
      data: {
        photo: photoUrl,
        user: updatedUser
      }
    });
  } catch (err) {
    console.error('Error uploading user photo:', err);
    res.status(500).json({ error: err.message });
  }
};