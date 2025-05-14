const express = require('express');
const router = express.Router();
const { register, login, postBug, getBugs } = require('./userController');
const userAuth = require('./middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/bugs', userAuth, postBug);
router.get('/bugs', userAuth, getBugs);

module.exports = router;
