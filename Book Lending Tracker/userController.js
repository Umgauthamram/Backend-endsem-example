const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const booksData = [];
const userData = [];

const register = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "All fields are required" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    userData.push({ id: Date.now(), userName, password: hashedPassword, books: [] });
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", err });
  }
};

const login = async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) return res.status(400).json({ message: "All fields are required" });

  const user = userData.find(u => u.userName === userName);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ userName }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({ message: `Welcome ${userName}` });
};

const addBook = async (req, res) => {
  const { title, borrowerName, dueDate } = req.body;
  if (!title || !borrowerName || !dueDate) return res.status(400).json({ message: "All fields are required" });

  const user = userData.find(u => u.userName === req.user.userName);
  user.books.push({ id: Date.now(), title, borrowerName, dueDate });

  res.status(200).json({ message: "Book added successfully" });
};

const getBooks = async (req, res) => {
  const user = userData.find(u => u.userName === req.user.userName);
  res.status(200).json({ books: user.books });
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  const user = userData.find(u => u.userName === req.user.userName);
  const bookIndex = user.books.findIndex(book => book.id == id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: "Book not found" });
  }

  user.books.splice(bookIndex, 1);
  res.status(200).json({ message: "Book removed successfully" });
};

module.exports = { register, login, addBook, getBooks, deleteBook };
