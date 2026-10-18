const express = require('express');
const Education = require('../models/Education');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res, next) => {
  try { res.json(await Education.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});
router.post('/', auth, async (req, res, next) => {
  try { res.json(await Education.create(req.body)); } catch (e) { next(e); }
});
router.put('/:id', auth, async (req, res, next) => {
  try { res.json(await Education.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); }
});
router.delete('/:id', auth, async (req, res, next) => {
  try { await Education.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
