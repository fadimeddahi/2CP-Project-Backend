const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { checkAuth, checkRole } = require('../middleware/auth');

// GET /api/workouts?level=débutant
router.get('/', workoutController.getWorkoutsByLevel);

// POST /api/workouts (Coach or Admin)
router.post(
  '/',
  checkAuth,
  checkRole('coach', 'admin'),
  workoutController.createWorkout
);

module.exports = router;