const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');

// GET /weather - Returns current weather
router.get('/weather', authMiddleware, (req, res) => {
  res.json({
    temp: 29,
    city: 'Chennai',
    condition: 'Sunny'
  });
});

module.exports = router;
