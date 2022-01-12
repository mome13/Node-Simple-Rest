var express = require('express');
var authRouter = require('./administrators/authentication');
var app = express();


app.use('/auth/', authRouter);

module.exports = app;
