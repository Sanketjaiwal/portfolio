const express = require('express');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Skill.find()); } catch (e) { next(e); }
});
router.post('/', auth, async (req, res, next) => {
  try { res.json(await Skill.create(req.body)); } catch (e) { next(e); }
});
router.put('/:id', auth, async (req, res, next) => {
  try { res.json(await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try { await Skill.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
