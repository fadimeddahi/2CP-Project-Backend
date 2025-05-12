const mongoose = require('mongoose');


// Schema for individual order items
const OrderItemSchema = new mongoose.Schema(
  {
    produit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantite: {
      type: Number,
      required: true,
      min: [1, 'La quantité doit être au moins 1'],
    },
    prixUnitaire: {
      type: Number,
      required: true,
      min: [0, 'Le prix unitaire ne peut pas être négatif'],
    },
  },
  { _id: false } // Prevents creating a separate _id for each order item
);


// Schema lel orders
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
   
    client: {
      nom: { type: String, required: true, trim: true },
      prenom: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        match: [/^\S+@\S+\.\S+$/, 'Email invalide'],
      },
    },
   
    produits: {
      type: [OrderItemSchema],
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: 'La commande doit contenir au moins un produit.',
      },
    },
   
    detailsPaiement: {
      sousTotal: { type: Number, required: true, min: 0 },
      fraisLivraison: { type: Number, default: 0, min: 0 },
      reduction: { type: Number, default: 0, min: 0, max: 100 },
      totalFinal: { type: Number, required: true, min: 0 },
    },
    
    adresseLivraison: {
      type: String,
      required: true,
      minlength: [10, 'L\'adresse est trop courte'],
    },
    
  },
  { timestamps: true }
);


// Indexes for performance
OrderSchema.index({ user: 1 });
OrderSchema.index({ statut: 1 });



// Middleware to calculate payment details before saving
OrderSchema.pre('save', function (next) {
  try {
    // Calculate subtotal
    this.detailsPaiement.sousTotal = this.produits.reduce(
      (sum, item) => sum + item.prixUnitaire * item.quantite,
      0
    );


    // Calculate final total
    this.detailsPaiement.totalFinal =
      this.detailsPaiement.sousTotal +
      this.detailsPaiement.fraisLivraison -
      (this.detailsPaiement.sousTotal * this.detailsPaiement.reduction) / 100;

    next();
  } catch (error) {
    next(error);
  }
});


module.exports = mongoose.model('Order', OrderSchema);