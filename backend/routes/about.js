const express = require('express');
const About = require('../models/About');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await About.findOne()); } catch (e) { next(e); }
});

router.put('/', auth, async (req, res, next) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    res.json(about);
  } catch (e) { next(e); }
});

module.exports = router;
