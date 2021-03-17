const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Please enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
  },
});

// userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         return Promise.reject(new Error('Incorrect email or password'));
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise.reject(new Error('Incorrect email or password'));
//           }

//           return user;
//         });
//     });
// };

// // eslint-disable-next-line func-names
// userSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

module.exports = mongoose.model('user', userSchema);
