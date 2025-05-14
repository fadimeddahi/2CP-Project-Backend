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
    const { category } = req.query;  // Use req.query instead of req.params
    
    // Build query based on whether category is provided
    const query = category 
      ? { categorie: category, stock: { $gt: 0 } } 
      : { stock: { $gt: 0 } };
    
    console.log('Products query:', query);
    
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
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




// Add this new function to handle image uploads for products
exports.uploadProductImage = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
    
    // Generate file URL
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/products/${req.file.filename}`;
    
    // Update product with new image URL
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { imageUrl },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        imageUrl,
        product: updatedProduct
      }
    });
  } catch (err) {
    console.error('Error uploading product image:', err);
    res.status(500).json({ error: err.message });
  }
};
