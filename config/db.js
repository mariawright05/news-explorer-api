require('dotenv').config();
const mongoose = require('mongoose');

const { mongoURI } = process.env;

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
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
