const Product = require('../models/Product');



// Ajouter un produit
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};





// Récupérer les produits par catégorie (stock > 0)
exports.getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.find({ 
      categorie: req.params.category, 
      stock: { $gt: 0 } 
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Mettre à jour un produit
exports.updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





// Supprimer un produit
exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.productId);
    if (!deleted) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
