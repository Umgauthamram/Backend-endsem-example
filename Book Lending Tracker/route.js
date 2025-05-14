const express = require('express');
const { register, login, addBook, getBooks, deleteBook } = require('./userController');
const verifyToken = require('./middleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/books', verifyToken, addBook);
router.get('/books', verifyToken, getBooks);
router.delete('/books/:id', verifyToken, deleteBook);

module.exports = router;
