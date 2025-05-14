const express = require('express');
const router = express.Router();
const userAuth = require('./middleware');
const {
  register,
  login,
  createJournal,
  getJournals,
  updateJournal
} = require('./userController');

router.post('/register', register);
router.post('/login', login);
router.post('/journal', userAuth, createJournal);
router.get('/journal', userAuth, getJournals);
router.put('/journal/:id', userAuth, updateJournal);

module.exports = router;
