const Order = require('../models/Order');
const Product = require('../models/Product');




// Créer une commande avec restriction de stock
exports.createOrder = async (req, res) => {
  try {
    const { userId, produits } = req.body;





    // Vérifier la disponibilité des produits
    for (let item of produits) {
      const produit = await Product.findById(item.product);
      if (!produit) {
        return res.status(404).json({ error: `Produit non trouvé: ${item.product}` });
      }
      if (produit.stock < item.quantite) {
        return res.status(400).json({ error: `Stock insuffisant pour le produit : ${produit.nom}` });
      }
    }





    // Déduire le stock
    for (let item of produits) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantite } });
    }




    // Calculer le total
    const total = produits.reduce((sum, item) => sum + item.prix * item.quantite, 0);

    const order = new Order({ user: userId, produits, total });
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




// Obtenir les commandes d’un utilisateur
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate('produits.product');
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
