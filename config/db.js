require('dotenv').config();
const mongoose = require('mongoose');
const { mongoServer } = require('./utils');

const connectDB = () => {
  mongoose.connect(mongoServer, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;
