/*const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  description: String,
  repetitions: String, // Ex: "3x12"
  videoUrl: String
});

const WorkoutSchema = new mongoose.Schema({
  titre: { 
    type: String, 
    required: true 
  },
  exercices: [ExerciseSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  niveau: { 
    type: String, 
    enum: ['débutant', 'intermédiaire', 'avancé'],
    required: true 
  },
  duree: {  // En minutes
    type: Number, 
    min: [5, 'La durée minimale est de 5 minutes'] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', WorkoutSchema);*/