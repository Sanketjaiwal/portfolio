const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});
router.post('/', auth, async (req, res, next) => {
  try { res.json(await Project.create(req.body)); } catch (e) { next(e); }
});
router.put('/:id', auth, async (req, res, next) => {
  try { res.json(await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try { await Project.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
