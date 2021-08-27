const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const fs = require('fs');
const { validationResult } = require('express-validator');
const Place = require('../models/Place');

const getCoordsForAddress = require('../utils/location');
const User = require('../models/User');
const deleteFile = require('../utils/deleteFile');

exports.getPlaceById = async (req, res) => {
  const placeId = req.params.pid

  try {
    const place = await Place.findById(placeId);
    if (!place) {
      return res.status(404).json({ message: 'Could not find a place with the provided ID' });
    };
    res.status(200).json({ place: place.toObject({getters: true}) });
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
    res.status(500).json({ message: 'An unexpected error occurred while trying to get place by User ID' });
  }
};

exports.createPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    deleteFile(req);
    return res.status(400).json({ message: 'Invalid inputs. Kindly check your inputs' });
  }
  const { title, description, address, creator } = req.body;
  
  let coordinates
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    deleteFile(req);
    console.log(error);
    res.status(500).json({ message: error });
  }
  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image: req.file.path,
    creator,
  });
  
  const user = await User.findById(creator);
  if (!user) {
    deleteFile(req);
    return res.status(404).json({message: 'Creator is not a registered user.'})
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
    
    res.status(201).json({ place: createdPlace.toObject({getters: true}) });
  } catch (error) {
    deleteFile(req);
    console.log(error);
    res.status(400).json({ message: 'An unexpected server error occurred.' });
  }
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
    const place = await Place.findOneAndUpdate({ _id: id }, newPlace, { new: true });
    place.save();
    
    res.status(200).json({ place: place.toObject({getters: true}) });
  } catch (error) {
    console.log(error)
    return res.status(404).json({ message: 'Place with provided ID does not exist' })
  }
};

exports.deletePlace = async (req, res) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate('creator');
  } catch (err) {
    res.status(404).json({
      message:'Could not find place for this id.'
    })
  }

  if (!place) {
    return res.status(404).json({ message: 'Could not find place for this id.'});
  }

  const imagePath = place.image

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    res.status(500).json({message: 'unexpected server error'})
  }

  await fs.unlink(imagePath, err => {
    console.log(err)
  });
  res.status(200).json({ message: 'Deleted place.' });

};
