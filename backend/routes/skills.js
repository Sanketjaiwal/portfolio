const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Skill.find()));
router.post('/', auth, async (req, res) => res.json(await Skill.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
