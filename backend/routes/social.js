const express = require('express');
const Social = require('../models/Social');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Social.find()); } catch (e) { next(e); }
});
router.post('/', auth, async (req, res, next) => {
  try { res.json(await Social.create(req.body)); } catch (e) { next(e); }
});
router.put('/:id', auth, async (req, res, next) => {
  try { res.json(await Social.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try { await Social.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
