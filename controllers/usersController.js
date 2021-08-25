const { validationResult } = require('express-validator');
const { v4: uuid } = require('uuid');

const User = require('../models/User');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: 'testers'
  }
];

exports.getUsers = (req, res) => {
  res.status(200).json({ users: DUMMY_USERS });
};

exports.signup = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid Input. Kindly check your input values,' });
  }
  const { name, email, password } = req.body;

  let user;
  try {
    user = await User.find({ email });
  } catch (error) {
    res.status(422).json({ message: 'User with provided email already exists' });
  }

  const newUser = new User({
    name,
    email,
    password,
    image: 'http:gogo',
    places: 'this are my places'
  });

  await newUser.save();
  res.status(201).json({ user: newUser });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(u => u.email === email);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'User does not exist.' });
  };

  res.status(200).json({ message: 'login successful' });
};
