const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController.js');
const { checkAuth } = require('../middlewares/auth.js'); // Corrected path

// POST /api/posts
router.post('/', checkAuth, postController.createPost);

// POST /api/posts/:postId/comments
router.post('/:postId/comments', checkAuth, postController.addComment);

module.exports = router;