const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const { validationResult } = require('express-validator');

const User = require('../models/user');

// @route     GET /users/me
// @desc      Get logged in user (email, name)
// @access    Private
const getUser = async (req, res) => {
  try {
    // req.user from auth middleware
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route     POST /signup
// @desc      Register a user
// @access    Public
const registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // change error
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      // change error
      return res.status(400).json({ msg: 'User already exists' });
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

    jwt.sign(payload, config.get('JWT_SECRET'), {
      expiresIn: '7d',
      // change error
    }, (err, token) => {
      if (err) throw (err);
      res.json({ token });
    });
  } catch (err) {
    // change error
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route     POST /signin
// @desc      Auth user & get token
// @access    Public
const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // change error
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, config.get('JWT_SECRET'), {
      expiresIn: '7d',
      // change error
    }, (err, token) => {
      if (err) throw (err);
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getUser,
  registerUser,
  loginUser,
};
