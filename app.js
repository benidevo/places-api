const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const PlacesRoutes = require('./routes/placesRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
  next();
});

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
