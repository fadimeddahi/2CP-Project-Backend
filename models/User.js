const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema(
  {
    // 1. Informations personnelles (UI: Formulaire d'inscription + Profil)
    firstName: { 
      type: String, 
      required: [true, 'Le prénom est obligatoire'],
      trim: true
    },
    lastName: { 
      type: String, 
      required: [true, 'Le nom est obligatoire'],
      trim: true
    },
    email: { 
      type: String, 
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Email invalide']
    },
    phone: { 
      type: String, 
      match: [/^\+?[\d\s-]{10,}$/, 'Numéro de téléphone invalide'] 
    },
    gender: { 
      type: String, 
      enum: ['homme', 'femme'], // Adaptez selon vos besoins
      required: false 
    },
    status: { 
      type: String, 
      enum: ['athlète', 'coach'], 
      default: 'athlète' 
    },
    photo: { 
      type: String, 
      default: 'default.jpg' // Chemin vers une image par défaut
    },

    // 2. Authentification (UI: Connexion)
    password: { 
      type: String, 
      required: [true, 'Le mot de passe est obligatoire'],
      minlength: 8,
      select: false 
    },
    role: { 
      type: String, 
      enum: ['user', 'coach', 'admin'],
      default: 'user' 
    },

    // 3. Abonnement & Salle (UI: Formulaire d'inscription)
    subscription: { 
      type: String,
      enum: ['basic', 'premium', 'vip'], 
      required: false 
    },
    gym: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Gym', // Supposant un modèle "Gym" pour les salles
      required: false 
    },

    // 4. Réinitialisation de mot de passe (UI: Lien "Mot de passe oublié")
    passwordResetToken: String,
    passwordResetExpires: Date,

    // 5. Timestamps
    createdAt: { 
      type: Date, 
      default: Date.now 
    },
    updatedAt: Date
  }, 
  { 
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true } 
  }
);

// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
UserSchema.pre('save', async function (next) {
  // Si le mot de passe n'est pas modifié, passez au middleware suivant
  if (!this.isModified('password')) return next();

  // Hache le mot de passe avec un coût de 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare le mot de passe fourni avec le mot de passe haché dans la base de données
UserSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
    
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  // Return the plain token (not the hashed one)
  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);