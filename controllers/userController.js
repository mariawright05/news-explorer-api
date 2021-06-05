require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validationResult } = require('express-validator');
const { secretKey } = require('../config/utils');

const User = require('../models/user');
const { notFoundError, validationError, conflictError } = require('../middleware/errors/ApiError');

// @route     GET /users/me
// @desc      Get logged in user (email, name)
// @access    Private
const getUser = async (req, res, next) => {
  try {
    // req.user from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      next(notFoundError('User does not exist'));
    }
    res.json(user);
  } catch (err) {
    next(validationError('Invalid user ID'));
  } finally {
    next();
  }
};

// @route     POST /signup
// @desc      Register a user
// @access    Public
const registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ error: errors.array() }));
  }

  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      next(conflictError('User already exists'));
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSaltSync(10);

    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, secretKey, {
      expiresIn: '7d',
    }, (err) => {
      if (err) throw (err);
      res.send({ name, email });
    });
  } catch (err) {
    next();
  }
};

// @route     POST /signin
// @desc      Auth user & get token
// @access    Public
const loginUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(validationError({ errors: errors.array() }));
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      next(validationError('Invalid Credentials'));
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      next(validationError('Invalid Credentials'));
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, secretKey, {
      expiresIn: '7d',
    }, (err, token) => {
      if (err) throw (err);
      res.json({ token });
    });
  } catch (err) {
    next();
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
