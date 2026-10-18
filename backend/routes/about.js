const express = require('express');
const About = require('../models/About');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
  const about = await About.findOne();
  res.json(about);
});

router.put('/', auth, async (req, res) => {
  const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
  res.json(about);
});

module.exports = router;
