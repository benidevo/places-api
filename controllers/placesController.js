const {v4: uuid} = require('uuid');

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

exports.getPlaceById = (req, res) => {
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
};

exports.getPlacesByUserId = (req, res) => {
  const userId = req.params.uid
  
  const places = DUMMY_PLACES.find(p => {
    return p.creator === userId
  });
  
  if (!places || places.length === 0) {
    return next(
      new Error('Could not find any place with the provided user ID', 404)
    );
  };
  res.json({ places });
};

exports.createPlace = (req, res) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = (req, res) => {
  const { title, description } = req.body;
  const id = req.params.pid;

  const place = DUMMY_PLACES.find(p => {
    return p.id === id;
  });

  place.title = title;
  place.description = description;
  
  res.status(200).json({ place: place });
};

exports.deletePlace = (req, res) => {
  const id = req.params.pid;

  const place = DUMMY_PLACES.find(p => {
    return p.id === id;
  });

  delete place;
  res.status(204).json({ message: 'Successfully deleted a place'});
};
