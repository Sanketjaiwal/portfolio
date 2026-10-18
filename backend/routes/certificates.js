const express = require('express');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Certificate.find().sort({ createdAt: -1 })));
router.post('/', auth, async (req, res) => res.json(await Certificate.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Certificate.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
