const Workout = require('../models/Workout');

// Créer un programme
exports.createWorkout = async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      createdBy: req.user.id // ID du coach/admin
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Récupérer les programmes par niveau
exports.getWorkoutsByLevel = async (req, res) => {
  try {
    const workouts = await Workout.find({ niveau: req.params.level });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};