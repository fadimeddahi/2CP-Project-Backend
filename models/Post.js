const mongoose = require('mongoose');

// Schema ta3 comments
const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    texte: {
      type: String,
      required: true,
      maxlength: [500, 'Le commentaire est trop long'],
    },
  },
  { timestamps: true }
);



// Schema ta3 posts
const PostSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: [true, 'Le titre est obligatoire'],
      maxlength: [100, 'Le titre est trop long'],
      trim: true,
    },

    image: {
      type: String,  // URL de l'image
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|webp)$/, 'URL d\'image invalide']
    },

    contenu: {
      type: String,
      required: true,
      maxlength: [2000, 'le contenu est trop long'],
    },

    auteur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    type: {
      type: String,
      enum: ['blog', 'forum'],
      default: 'forum',
    },

    tags: {
      type: [String],
      enum: ['fitness', 'nutrition', 'cardio'],
      default: [], // Default to an empty array
    },

    commentaires: [CommentSchema],
    slug: {
      type: String,
      unique: true,
      trim: true,
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    nombreVues: {
      type: Number,
      default: 0
    },

  },


  { timestamps: true }
);

// Full-text search index ta3 title w content
PostSchema.index({ titre: 'text', contenu: 'text' });


// Middleware to generate slug from title before saving
PostSchema.pre('save', function (next) {
  if (this.isModified('titre')) {
    try {
      this.slug = this.titre.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    } catch (error) {
      return next(error);
    }
  }
  next();
});


module.exports = mongoose.model('Post', PostSchema);