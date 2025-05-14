const express = require('express');
const router = express.Router();
const { register, login, feedBack, getFeed } = require('./userController');
const userAuth = require('./middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/feedBack', userAuth, feedBack);
router.get('/getFeed', userAuth, getFeed);

module.exports = router;
