const express = require('express');
const router = express.Router();

const HttpError = require('../models/httpError');

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous sky scrapers in the world!',
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: '20 W 34th St, New York, NY 10001',
    creator: 'u1'
  }
];

router.get('/:pid', (req, res) => {
  const placeId = req.params.pid

  const place = DUMMY_PLACES.find(p => {
    return p.id === placeId
  });

  if (!place) {
    return next(
      new HttpError('Could not find a place with the provided ID', 404)
    );
  };
  
  res.json({ place: place });
});

router.get('/user/:uid', (req, res) => {
  const userId = req.params.uid
  
  const place = DUMMY_PLACES.find(p => {
    return p.creator === userId
  });
  
  if (!place) {
    return next(
      new Error('Could not find a place with the provided user ID', 404)
    );
  };
  res.json({ place });
});

module.exports = router;
