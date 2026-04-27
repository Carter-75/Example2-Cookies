const express = require('express');
const router = express.Router();
const Cookie = require('../models/cookie');

// GET all cookies
router.get('/', async (req, res) => {
  try {
    const cookies = await Cookie.find().sort({ isBestseller: -1, name: 1 });
    res.json(cookies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
