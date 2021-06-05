const express = require('express');
const { check } = require('express-validator');
const { getArticles, createArticle, deleteArticle } = require('../controllers/articleController');
const auth = require('../middleware/auth');

const router = express.Router();

// @route     GET /articles
// @desc      Get all articles saved by user
// @access    Private
router.get('/', auth, getArticles);

// @route     POST /articles
// @desc      Creates article with passed keyword, title, text, date source, url, and image
// @access    Private
router.post('/',
  auth,
  [
    auth, [
      check('url', 'URL is not a valid URL').isURL(),
      check('image', 'Image is not a valid URL').isURL(),
      check('title', 'Title is required').not().isEmpty(),
      check('text', 'Text is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('source', 'Source is required').not().isEmpty(),
      check('keyword', 'Keyword is required').not().isEmpty(),
    ],
  ], createArticle);

// @route     DELETE /articles
// @desc      Deletes a stored article by _id
// @access    Private
router.delete('/:articleId', auth, deleteArticle);

module.exports = router;
