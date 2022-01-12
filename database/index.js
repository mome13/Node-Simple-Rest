'use strict';
const mongoose = require('mongoose');
const dbName = 'notifications';
const mongo = {
  uri: `${process.env.MONGODB_URL}${dbName}`,
  opt: {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    background: false,
    useFindAndModify: false,
  },
};

exports.connect = () => {
  return mongoose.connect(mongo.uri, mongo.opt).then(() => {
    return mongoose.connection;
  });
};