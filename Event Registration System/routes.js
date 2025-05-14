const express = require('express');
const router = express.Router();
const {
  register,
  login,
  registerEvent,
  getMyEvents
} = require('./userController');
const userAuth = require('./authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/event', userAuth, registerEvent);
router.get('/event', userAuth, getMyEvents);

module.exports = router;
