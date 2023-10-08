const jwt = require('jsonwebtoken');

const secretKey = "E3#fd&jKs^2P$lmnGhT4*qR@W5tYzXv";


const generateToken = (user) => {
  const payload = { userId: user.id, username: user.username };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const payload = jwt.verify(token, secretKey);
    req.user = payload;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = { generateToken, verifyToken };
