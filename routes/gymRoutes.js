const express = require('express');
const router = express.Router();
const gymController = require('../controllers/gymController');

// GET /api/gyms?ville=Béjaïa
// Récupérer les salles par localisation (ville)
router.get('/', gymController.getGymsByLocation);

// POST /api/gyms (Admin only)
// Créer une nouvelle salle
router.post('/', gymController.createGym);

// POST /api/gyms/:gymId/coachs/:coachId
// Ajouter un coach à une salle
router.post('/:gymId/coachs/:coachId', gymController.addCoachToGym);

// GET /api/gyms/search?q=terme
// Recherche par nom ou ville
router.get('/search', gymController.searchGyms);

// GET /api/gyms/:id
// Obtenir les détails d'une salle
router.get('/:id', gymController.getGymDetails);

module.exports = router;