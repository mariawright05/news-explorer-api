const { validationResult } = require('express-validator');

// const User = require('../models/user');
const Article = require('../models/article');

// @route     GET /articles
// @desc      Get all articles saved by user
// @access    Private
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ owner: req.user.id });

    res.json(articles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route     POST /articles
// @desc      Creates article with passed keyword, title, text, date source, link, and image
// @access    Private
const createArticle = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // change error
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  try {
    const newArticle = new Article({
      keyword,
      title,
      text,
      date,
      source,
      link,
      image,
      owner: req.user.id,
    });

    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route     DELETE /articles
// @desc      Deletes a stored article by _id
// @access    Private
const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.articleId);

    if (!article) return res.status(404).json({ msg: 'Not authorized' });

    if (article.owner.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Article.findByIdAndRemove(req.params.articleId);

    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
