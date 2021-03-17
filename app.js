const express = require('express');
const { check } = require('express-validator');
const connectDB = require('./config/db');
const { registerUser, loginUser } = require('./controllers/userController');

const app = express();
const { requestLogger, errorLogger } = require('./middleware/logger');

// Connect database
connectDB();

app.get('/', (req, res) => {
  res.json({ msg: 'Welcome to the News Explorer API' });
});

// init middleware
app.use(express.json({ extended: false }));

// define routes
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
// const NotFoundError = require('./middleware/errors/NotFoundError');

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

// @route     POST /signup
// @desc      Register a user (name, email, password)
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
// @desc      Auth user (email, password) & get token
// @access    Public
app.use('/signin', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
], loginUser);

// Private routes
app.use('/users', userRouter);
app.use('/articles', articleRouter);

// enabling the error logger
app.use(errorLogger);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
