const express = require('express');
const body = require('body-parser');

const PlacesRoutes = require('./routes/placesRoutes');

const app = express();

app.use('/api/places', PlacesRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  };
  res.status(error.code || 505);
  res.json({ message: 'An unknown error occurred' });
});

app.listen(5000, () => console.log('listening'))
