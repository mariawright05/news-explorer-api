require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
// const path = require('path');
const apiErrorHandler = require('./middleware/errors/apiErrorHandler');
const limiter = require('./middleware/limiter');
const connectDB = require('./config/db');
const routes = require('./routes');

const app = express();
const { requestLogger, errorLogger } = require('./middleware/logger');

app.use(helmet());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.options('*', cors());
app.use(express.json(), cors(corsOptions));

// Connect database
connectDB();

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
app.set('trust proxy', 1);

//  apply to all requests
app.use(limiter);

// init middleware
app.use(express.json({ extended: false }));

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Server will crash now');
  }, 0);
});

app.use(compression());

app.use(routes);

// enabling the error logger
app.use(errorLogger);

app.use(apiErrorHandler);

// // Serve static assets in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('frontend/build'));
//   app.use('*', (req, res) => res.sendFile(path.resolve('/Users/mariawright/dev/news-explorer-frontend/public/index.html')));
// }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
