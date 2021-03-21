const { validationResult } = require('express-validator');
const { validationError, notFoundError, authError } = require('../middleware/errors/ApiError');

// const User = require('../models/user');
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
// @desc      Creates article with passed keyword, title, text, date source, link, and image
// @access    Private
const createArticle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    next(validationError({ errors: errors.array() }));
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

    res.json({ msg: 'Article removed' });
  } catch (err) {
    next(validationError('Article id is not valid'));
  } finally {
    next();
  }
};

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
