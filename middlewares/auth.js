
// Middleware to protect routes (authentication)
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Authentification requise' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Définir req.user avec les données du token
    next();
  } catch (err) {
    res.status(401).json({ 
      status: 'error',
      message: 'Token invalide ou expiré' 
    });
  }
};





// Middleware to restrict access based on roles
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Accès non autorisé'
      });
    }
    next();
  };
};




// Middleware to check if the user has a specific role
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied. Insufficient permissions.',
      });
    }
    next();
  };
};




// Middleware to check if the user is authenticated
const checkAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'You are not authenticated.',
    });
  }
  next();
};

module.exports = {
  protect,
  restrictTo,
  checkAuth,
  checkRole,
};