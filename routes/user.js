const express = require('express');
const passport = require('passport');
const { generateToken, verifyToken } = require('../middlewares/jwt-middleware');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.post('/register', [
  check('username').notEmpty().isLength({ min: 4 }).trim().escape(),
  check('password').isLength({ min: 6 }),
], async (req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error registering user.' });
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json(info);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      const token = generateToken(user);
      return res.json({ token });
    });
  })(req, res, next);
});

router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You have access to this protected route!', user: req.user });
});

module.exports = router;
