const express = require('express');
const Education = require('../models/Education');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Education.find().sort({ createdAt: -1 })));
router.post('/', auth, async (req, res) => res.json(await Education.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Education.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Education.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
