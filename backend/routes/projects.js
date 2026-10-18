const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Project.find().sort({ createdAt: -1 })));
router.post('/', auth, async (req, res) => res.json(await Project.create(req.body)));
router.put('/:id', auth, async (req, res) => res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', auth, async (req, res) => { await Project.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); });

module.exports = router;
