const express = require('express');
const { check } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/usersController');

router.get('/', userController.getUsers);

router.post('/signup', [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({min:6}),
], userController.signup);

router.post('/login', userController.login);

module.exports = router;
