const express = require('express');
const bodyParser = require('body-parser');

const PlacesRoutes = require('./routes/placesRoutes');
const HttpError = require('./models/httpError');

const app = express();

app.use(bodyParser.json());

app.use('/api/places', PlacesRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Invalid route', 404);
  next(error);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  };
  res.status(error.code || 505);
  res.json({ message: 'An unknown error occurred' });
});

app.listen(5000, () => console.log('listening'))
