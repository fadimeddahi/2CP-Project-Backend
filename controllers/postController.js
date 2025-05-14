const Post = require('../models/Post');



// Créer un post (article ou forum)
exports.createPost = async (req, res) => {
  try {
    const post = new Post({
      ...req.body,
      auteur: req.user.id // ID de l'utilisateur connecté (JWT)
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { $push: { commentaires: { user_id: req.user.id, texte: req.body.texte } } },
      { new: true }
    );
    res.json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete 