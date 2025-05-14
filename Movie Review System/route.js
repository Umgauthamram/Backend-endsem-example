const express = require('express');
const { register, login, postReview, getReviews } = require('./userController');
const verifyToken = require('./middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reviews', verifyToken, postReview);
router.get('/reviews', verifyToken, getReviews);

module.exports = router;
