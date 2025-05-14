const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { checkAuth, checkRole } = require('../middlewares/auth');

router.get('/', newsController.getAllNews);
router.post('/', checkAuth, checkRole('admin'), newsController.createNews);
router.delete('/:id', checkAuth, checkRole('admin'), newsController.deleteNews);

module.exports = router;
