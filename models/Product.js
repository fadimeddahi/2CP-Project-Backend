const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {

    // Notes + ratings for the product
    notes: {
      type: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          valeur: { type: Number, min: 1, max: 5 },
        },
      ],
      default: [], // Default to an empty array
    },


    // Image URL of the product
    imageUrl: {
      type: String,
      match: [/^https?:\/\/.+\..+/, 'URL d\'image invalide'],
      default: 'https://example.com/default-image.png',
    },


    // Name Ta3 product
    nom: {
      type: String,
      required: [true, 'Le nom du produit est obligatoire'],
      trim: true,
    },


    // Price
    prix: {
      type: Number,
      required: true,
      min: [0, 'Le prix ne peut pas être négatif'],
    },


    // Description ta3o
    description: {
      type: String,
      maxlength: [500, 'La description ne doit pas dépasser 500 caractères'],
    },

   
   
    // Category ta3o
    categorie: {
      type: String,
      enum: ['protein', 'equipement', 'nutrition', 'greens', 'mockup', 'accessoire'],
      required: true,
    },

    // Stock of the product
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Le stock ne peut pas être négatif'],
    },

    

    
  },

  { timestamps: true }
);



// Index for faster queries by product name
ProductSchema.index({ nom: 1 });


// Virtual field for the average rating
ProductSchema.virtual('moyenneNotes').get(function () {
  if (!this.notes || this.notes.length === 0) return 0;
  return this.notes.reduce((sum, note) => sum + note.valeur, 0) / this.notes.length;
});


// Pre-save middleware 
ProductSchema.pre('save', function (next) {
  //moyenneNotes rahi handled by the virtual field makaleh ndifiniha
  next();
});


module.exports = mongoose.model('Product', ProductSchema);