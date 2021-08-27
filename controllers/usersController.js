const { validationResult } = require('express-validator');

const User = require('../models/User');
const deleteFile = require('../utils/deleteFile');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    if (!users) {
      return res.status(404).json({ message: 'error trying to get users' })
    };

    res.status(200).json({ users: users.map(user => user.toObject({ getters: true })) });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'unexpected server error'})
  }
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    deleteFile(req)
    return res.status(400).json({ message: 'Invalid Input. Kindly check your input values,' });
  }
  const { name, email, password } = req.body;

  
  try {
    const user = await User.findOne({ email: email });

    if (user) {
      deleteFile(req)
      return res.status(422).json({ message: 'User with provided email already exists' });
    };
    
    const newUser = new User({
      name,
      email,
      password,
      image: req.file.path,
      places: []
    });
    
    await newUser.save();
    res.status(201).json({ user: newUser.toObject({getters: true}) });
  } catch (error) {
    deleteFile(req)
    console.log(error);
    res.status(500).json({message: 'unexpected server error'})
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  let user;
  try {
    user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'user does not exist' });
    };
    
    if (user.password !== password) {
      return res.status(401).json({ message: 'Incorrect password.' });
    };
    res.status(200).json({ message: 'login successful', user: user.toObject({getters: true})});
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Unexpected server error'})
  }
};
