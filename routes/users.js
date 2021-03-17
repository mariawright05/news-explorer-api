const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const router = express.Router();
const { check, validationResult } = require('express-validator');

const User = require('../models/user');

// @route     POST api/users
// @desc      Register a user
// @access    Public
router.post('/', [
  check('name', 'Please add name')
    .not()
    .isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters',
  ).isLength({ min: 6 }),
],

async (req, res) => {
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

    jwt.sign(payload, config.get('jwtSecret'), {
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
});

module.exports = router;
