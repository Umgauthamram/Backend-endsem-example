const express = require('express');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cookieParser());
app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
