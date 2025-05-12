const express = require('express');
const router = express.Router();

// Import des routes
router.use('/auth', require('./authRoutes'));
router.use('/users', require('./userRoutes'));
router.use('/gyms', require('./gymsRoutes'));
router.use('/products', require('./productRoutes'));
router.use('/orders', require('./orderRoutes'));
router.use('/posts', require('./postRoutes'));
router.use('/workouts', require('./workoutRoutes'));

// Gestion des erreurs 404
router.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

router.use('/news', require('./newsRoutes'));

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l’API AthelX 🚀' });
});



module.exports = router;