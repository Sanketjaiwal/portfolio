const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/certificates');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', async (req, res, next) => {
  try { res.json(await Certificate.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', auth, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/certificates/${req.file.filename}`;
    res.json(await Certificate.create(data));
  } catch (e) { next(e); }
});

router.put('/:id', auth, upload.single('image'), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.image = `/uploads/certificates/${req.file.filename}`;
      // delete old image if exists
      const old = await Certificate.findById(req.params.id);
      if (old?.image) {
        const oldPath = path.join(__dirname, '..', old.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
    }
    res.json(await Certificate.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (cert?.image) {
      const imgPath = path.join(__dirname, '..', cert.image);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
