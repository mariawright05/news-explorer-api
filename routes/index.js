const { check } = require('express-validator');
const router = require('express').Router();
const { registerUser, loginUser } = require('../controllers/userController');

// define routes
const userRouter = require('./users');
const articleRouter = require('./articles');

// @route     POST /signup
// @desc      Register a user (name, email, password)
// @access    Public
router.use('/api/signup', [
  check('name', 'Please add name')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6 }),
], registerUser);

// @route     POST /signin
// @desc      Auth user (email, password) & get token
// @access    Public
router.use('/api/signin', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], loginUser);

// Private routes
router.use('/api/users', userRouter);
router.use('/api/articles', articleRouter);

module.exports = router;
