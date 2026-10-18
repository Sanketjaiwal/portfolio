const express = require('express');
const Social = require('../models/Social');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Social.find()));
router.post('/', auth, async (req, res) => res.json(await Social.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Social.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Social.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
