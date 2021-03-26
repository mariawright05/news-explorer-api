require('dotenv').config();
const mongoose = require('mongoose');
const { mongoServer } = require('./utils');

const connectDB = async () => {
  try {
    await mongoose.connect(mongoServer, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
  } catch (err) {
    process.exit(1);
  }
};

module.exports = connectDB;
