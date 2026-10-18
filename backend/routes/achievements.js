const express = require('express');
const Achievement = require('../models/Achievement');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Achievement.find().sort({ createdAt: -1 })));
router.post('/', auth, async (req, res) => res.json(await Achievement.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Achievement.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
