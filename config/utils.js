const { NODE_ENV, JWT_SECRET, MONGO_URI } = process.env;

const mongoServer = NODE_ENV === 'production' ? MONGO_URI : 'mongodb://localhost:27017/myFirstDatabase';

const secretKey = NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret';

module.exports = {
  mongoServer,
  secretKey,
};
