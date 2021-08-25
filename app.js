const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const PlacesRoutes = require('./routes/placesRoutes');
const usersRoutes = require('./routes/usersRoutes');
const HttpError = require('./models/httpError');

const app = express();

app.use(bodyParser.json());

// places routes
app.use('/api/places', PlacesRoutes);

// users routes
app.use('/api/users', usersRoutes);

const URI = process.env.URI;

mongoose
  .connect(URI)
  .then(() => {
    app.listen(5000, () => console.log('listening'));
  })
  .catch(err => {
    console.log(err);
  });
