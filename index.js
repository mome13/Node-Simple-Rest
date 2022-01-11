require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
var cors = require('cors');
const hpp = require('hpp');
const { VERSION, API_VERSION } = require('./constants');
const { errorHandler } = require('./utils');
const app = express();

app.use(hpp());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => res.send(VERSION));


app.use(errorHandler)
const PORT = process.env.PORT || 5008;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

module.exports = app;
