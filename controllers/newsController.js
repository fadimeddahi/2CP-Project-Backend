const News = require('../models/News');

exports.getAllNews = async (req, res) => {
  const news = await News.find().sort({ createdAt: -1 });
  res.status(200).json(news);
};

exports.createNews = async (req, res) => {
  const news = await News.create(req.body);
  res.status(201).json(news);
};

exports.deleteNews = async (req, res) => {
  await News.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'News supprimée' });
};
