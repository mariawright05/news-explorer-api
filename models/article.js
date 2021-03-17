const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    // must be URL
  },
  image: {
    type: String,
    required: true,
    // must be URL
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    // the _id of the user who saved the article.
    // You need to set the default behavior so that the database doesn't return this field.
  },
});

// articleSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
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
// articleSchema.methods.toJSON = function () {
//   const obj = this.toObject();
//   delete obj.password;
//   return obj;
// };

module.exports = mongoose.model('article', articleSchema);
