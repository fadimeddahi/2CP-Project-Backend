const Order = require('../models/Order');
const Product = require('../models/Product');




// Créer une commande avec restriction de stock
exports.createOrder = async (req, res) => {
  try {
    // Extract user ID from authenticated user or request body
    const userId = req.user?.id || req.body.userId;
    
    // Extract product details - convert from product to produit if needed
    let produits = req.body.produits.map(item => ({
      produit: item.product || item.produit,
      quantite: item.quantite,
      prixUnitaire: item.prix || item.prixUnitaire
    }));

    // Verify product availability
    for (let item of produits) {
      const produit = await Product.findById(item.produit);
      if (!produit) {
        return res.status(404).json({ error: `Produit non trouvé: ${item.produit}` });
      }
      if (produit.stock < item.quantite) {
        return res.status(400).json({ error: `Stock insuffisant pour le produit : ${produit.nom}` });
      }
    }

    // Reduce stock
    for (let item of produits) {
      await Product.findByIdAndUpdate(item.produit, { $inc: { stock: -item.quantite } });
    }

    // Calculate total
    const sousTotal = produits.reduce((sum, item) => sum + item.prixUnitaire * item.quantite, 0);
    
    // Create complete order object
    const orderData = {
      user: userId,
      produits,
      client: req.body.client,
      adresseLivraison: req.body.adresseLivraison,
      detailsPaiement: req.body.detailsPaiement || {
        sousTotal,
        fraisLivraison: req.body.fraisLivraison || 0,
        reduction: req.body.reduction || 0,
        totalFinal: sousTotal + (req.body.fraisLivraison || 0) - (req.body.reduction || 0)
      }
    };

    const order = new Order(orderData);
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




// Obtenir les commandes d'un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('produits.produit');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Supprimer une commande
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.status(200).json({ message: 'Commande supprimée avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




// Mettre à jour une commande
exports.updateOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ error: 'Commande non trouvée' });
    }
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
