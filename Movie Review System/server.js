const express = require('express');
const cookieParser = require('cookie-parser');
const route = require('./route');
require('dotenv').config();

const app = express();
const PORT = 6000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', route);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
