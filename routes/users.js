const express = require('express');

const router = express.Router();
const { getUser } = require('../controllers/userController');

const auth = require('../middleware/auth');

// @route     GET /users/me
// @desc      Get logged in user (email, name)
// @access    Private
router.get('/me', auth, getUser);

module.exports = router;
