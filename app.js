const express = require('express');
const { check } = require('express-validator');
const connectDB = require('./config/db');
const { registerUser, loginUser } = require('./controllers/userController');

const app = express();

// Connect database
connectDB();

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the News Explorer API' });
});

// init middleware
app.use(express.json({ extended: false }));

// define routes
app.use('/users', require('./routes/users'));
app.use('/articles', require('./routes/articles'));

// @route     POST /signup
// @desc      Register a user
// @access    Public
app.use('/signup', [
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
// @desc      Auth user & get token
// @access    Public
app.use('/signin', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], loginUser);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
