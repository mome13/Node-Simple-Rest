require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
var cors = require('cors');
const hpp = require('hpp');
const { VERSION } = require('./constants');
const database = require('./database');
const { errorHandler } = require('./utils');
const app = express();

app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.send(VERSION));

app.use(errorHandler);

async function connectToDatabase() {
  await database.connect();
}
connectToDatabase().then((err) => console.log(err));

const PORT = process.env.PORT || 5008;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

module.exports = app;
