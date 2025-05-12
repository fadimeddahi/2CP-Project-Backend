const mongoose = require('mongoose');

const GymSchema = new mongoose.Schema(
  
  {

  // Image ta3 la salle
  images: {
    type: [String],
    validate: {
      validator: function (value) {
        return value.every((img) => typeof img === 'string');
      },
      message: 'Toutes les images doivent être des chaînes de caractères.',
    },
  },


 //name ta3 gym
  nom: { 
    type: String, 
    required: [true, 'Le nom de la salle est obligatoire'],
    unique: true 
  },


  //les service li yofrihom le gym
  equipements: [
    { 
    type: String,
    enum: ['musculation', 'cardio', 'zumba', 'MMA' , 'fitness', 'yoga', 'boxe' , 'cours collectifs ' , 'piscine', 'crossfit' , 'haltérophilie' , 'coaching personnalisé '] 
    }
  ],


  //description ta3 gym
  description: String,



//localisation
localisation: {
  pays: { type: String , required : true} ,
  ville: { type: String, required: true },
  adresse: { type: String, required: true },
  coordinates: {
     type: [Number], 
     required: true,
    validate: {
      validator: function (value) {
         return value.length === 2; 
       },
       message: 'Les coordonnées doivent contenir exactement deux nombres : [longitude, latitude]',
     },
   },
},

  

coachs: [{ 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User' 
}
],


  //l'horaire
  horaires: {
    lundi: { ouverture: { type: String, default: '08:00' }, fermeture: { type: String, default: '20:00' } },
    mardi: { ouverture: { type: String, default: '08:00' }, fermeture: { type: String, default: '20:00' } },
    mercredi: { ouverture: { type: String, default: '08:00' }, fermeture: { type: String, default: '20:00' } },
    jeudi: { ouverture: { type: String, default: '08:00' }, fermeture: { type: String, default: '20:00' } },
    vendredi: { ouverture: { type: String, default: '08:00' }, fermeture: { type: String, default: '20:00' } },
    samedi: { ouverture: { type: String, default: '10:00' }, fermeture: { type: String, default: '18:00' } },
    dimanche: { ouverture: { type: String, default: '10:00' }, fermeture: { type: String, default: '16:00' } },
  },
},

{ timestamps: true }

);




  
  
  




// Index géospatial pour les recherches par proximité
GymSchema.index({ 'localisation.coordinates': '2dsphere' });

module.exports = mongoose.model('Gym', GymSchema);