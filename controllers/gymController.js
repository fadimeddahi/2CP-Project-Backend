const Gym = require('../models/Gym');




// Créer une salle
exports.createGym = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'Le corps de la requête est vide ou invalide.' });
    }

    const gym = new Gym(req.body);
    await gym.save();
    res.status(201).json(gym);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Récupérer les salles près d'une localisation
// Current implementation in gymController.js
exports.getGymsByLocation = async (req, res) => {
  try {
    const { ville } = req.query;
    
    // If no ville parameter is provided, get all gyms
    const query = ville ? { 'localisation.ville': ville } : {};
    
    const gyms = await Gym.find(query);
    res.json(gyms);
  } catch (err) {
    console.error('Error fetching gyms:', err);
    res.status(500).json({ error: err.message });
  }
};



// Ajouter un coach à une salle
exports.addCoachToGym = async (req, res) => {
  try {
    const gym = await Gym.findByIdAndUpdate(
      req.params.gymId,
      { $push: { coachs: req.params.coachId } },
      { new: true }
    );
    res.json(gym);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Rechercher une salle par nom ou ville
exports.searchGyms = async (req, res) => {
  try {
    const { q } = req.query;
    const gyms = await Gym.find({
      $or: [
        { nom: { $regex: q, $options: 'i' } },
        { 'localisation.ville': { $regex: q, $options: 'i' } }
      ]
    });
    res.json(gyms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// Détails d'une salle par ID
exports.getGymDetails = async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
      return res.status(404).json({ error: 'Salle non trouvée' });
    }
    res.json(gym);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add this new function to handle image uploads for gyms
exports.uploadGymImages = async (req, res) => {
  try {
    const gymId = req.params.id;
    
    // Check if gym exists
    const gym = await Gym.findById(gymId);
    if (!gym) {
      return res.status(404).json({ error: 'Salle non trouvée' });
    }
    
    // Process uploaded files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'Aucun fichier téléchargé' });
    }
    
    // Generate file URLs
    const imageUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/gyms/${file.filename}`);
    
    // Update gym with new images
    // If gym.images exists, append to it; otherwise create new array
    const updatedGym = await Gym.findByIdAndUpdate(
      gymId,
      { 
        $push: { 
          images: { $each: imageUrls } 
        } 
      },
      { new: true }
    );
    
    res.status(200).json({
      status: 'success',
      data: {
        images: imageUrls,
        gym: updatedGym
      }
    });
  } catch (err) {
    console.error('Error uploading gym images:', err);
    res.status(500).json({ error: err.message });
  }
};
