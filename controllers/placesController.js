const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');

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
    return res.status(404).json({ message: 'Could not find a place with the provided ID' });
  };
  
  res.json({ place: place });
};

exports.getPlacesByUserId = (req, res) => {
  const userId = req.params.uid
  
  const places = DUMMY_PLACES.find(p => {
    return p.creator === userId
  });
  
  if (!places || places.length === 0) {
    return res.status(404).json({ message: 'Could not find any place with the provided user ID' });
  };
  res.json({ places });
};

exports.createPlace = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid inputs. Kindly check your inputs' });
  }
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
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid inputs. Kindly check your inputs' });
  };

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

  if (!place) {
    return res.status(404).json({ message: 'Could not find a place for that ID' });
  }

  delete place;
  res.status(204).json({ message: 'Successfully deleted a place'});
};
