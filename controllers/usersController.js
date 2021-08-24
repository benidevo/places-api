const { v4: uuid } = require('uuid');
const HttpError = require('../models/httpError');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Max Schwarz',
    email: 'test@test.com',
    password: 'testers'
  }
];

exports.getUsers = (req, res) => {
  res.status(200).json({ users: DUMMY_USERS });
};

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  const user = DUMMY_USERS.find(u => u.email === email);
  if (user) {
    throw new HttpError('User with provided email already exists', 422);
  };

  const newUser = {
    id: uuid(),
    name,
    email,
    password
  };
  DUMMY_USERS.push(newUser);

  delete newUser.password;
  res.status(201).json({ user: newUser });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(u => u.email === email);
  if (!user || user.password !== password) {
    throw new HttpError('User does not exist', 401);
  };

  res.status(200).json({ message: 'login successful' });
};
