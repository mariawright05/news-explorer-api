const { validationResult } = require('express-validator');
const { validationError, notFoundError, authError } = require('../middleware/errors/ApiError');
const Article = require('../models/article');

// @route     GET /articles
// @desc      Get all articles saved by user
// @access    Private
const getArticles = async (req, res, next) => {
  try {
    const articles = await Article.find({ owner: req.user.id });
    res.json(articles);
  } catch (err) {
    next();
  }
};

// @route     POST /articles
// @desc      Creates article with passed keyword, title, text, date source, url, and image
// @access    Private
const createArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ errors: errors.array() }));
  }

  const {
    keyword,
    title,
    text,
    date,
    source,
    url,
    image,
  } = req.body;

  try {
    const newArticle = new Article({
      keyword,
      title,
      text,
      date,
      source,
      url,
      image,
      owner: req.user.id,
    });
    const article = await newArticle.save();
    res.json(article);
  } catch (err) {
    next(validationError('Unable to create article'));
  } finally {
    next();
  }
};

// @route     DELETE /articles
// @desc      Deletes a stored article by _id
// @access    Private
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.articleId);
    if (!article) {
      next(notFoundError('Article not found'));
    }

    if (article.owner.toString() !== req.user.id) {
      next(authError('Not authorized to delete this article'));
    }

    await Article.findByIdAndRemove(req.params.articleId);

    res.json('Article removed');
  } catch (err) {
    next(validationError('Invalid article ID'));
  } finally {
    next();
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
