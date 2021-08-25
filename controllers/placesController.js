const { v4: uuid } = require('uuid');
const { validationResult } = require('express-validator');
const Place = require('../models/Place');

const getCoordsForAddress = require('../utils/location');

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

exports.getPlaceById = async (req, res) => {
  const placeId = req.params.pid

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Could not find a place with the provided ID' });
    };
    res.status(200).json({ place: place });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while trying to get place by ID' });
  };
};

exports.getPlacesByUserId = async (req, res) => {
  const userId = req.params.uid
  
  try {
    const places = await Place.find({creator: userId});
    if (!places || places.length === 0) {
      return res.status(404).json({ message: 'Could not find any place with the provided user ID' });
    };
  
    res.status(200).json({ places })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'An unexpected error occurred while trying to get place by Usser ID' });
  }
};

exports.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid inputs. Kindly check your inputs' });
  }
  const { title, description, address, creator } = req.body;
  
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    res.status(400).json({ message: error });
  }
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80',
    creator
  });
  
  try {
    await createdPlace.save();
  } catch (error) {
    res.status(400).json({message: 'failed to save place'})
  }
  
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid inputs. Kindly check your inputs' });
  };

  const { title, description } = req.body;
  const id = req.params.pid;

  const newPlace = {
    title: title,
    description: description
  };

  try {
    const place = await Place.findOneAndUpdate({_id: id}, newPlace, {new: true});
    place.save();

    res.status(200).json({ place: place });
  } catch (error) {
    res.status(500).json({message: 'An unexpected error occurred while trying to update place'})
  }
};

exports.deletePlace = async (req, res) => {
  const id = req.params.pid;

  let place;
  try {
    place = await Place.findById(id);
  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: 'Could not find a place for that ID' });
  }

  place.delete();
  res.status(204).json({ message: 'Successfully deleted a place'});
};
