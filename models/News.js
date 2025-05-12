/*const mongoose = require('mongoose');


const newsSchema = new mongoose.Schema(
  {
  // Title ta3 article ta3na
    title: {
      type: String,
      required: true,
      maxlength: [200, 'Le titre ne doit pas dépasser 200 caractères'],
      trim: true,
    },

  // Content ta3 the news article
    content: {
      type: String,
      required: true,
      maxlength: [5000, 'Le contenu ne doit pas dépasser 5000 caractères'],
    },


  // Slug for URL-friendly title (optional)
    slug: {
      type: String,
      unique: true,
      trim: true,
    },
  },


  { timestamps: true } 
);




// Index lel titre 3la jal faster queries by title
newsSchema.index({ title: 1 });


// Middleware to generate slug from title before saving
newsSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});


module.exports = mongoose.model('News', newsSchema); */