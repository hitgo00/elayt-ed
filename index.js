const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
// const mongoose = require('mongoose');

// const DB_URL = process.env.DB_URL || '';
const port = process.env.PORT || 8000;

// mongoose
//   .connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch((error) => console.log('MongoDB Error:\n', error));

app.use(require('morgan')('dev'));
app.use(bodyParser.json());
app.use(cors());

// Import Routes
app.use('/', require('./utils/routes'));

app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Handle all the previous errors (including 404 and others)
app.use((error, req, res, next) => {
  console.log(req.body);
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
