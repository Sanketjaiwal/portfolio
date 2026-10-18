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

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const deleteOldFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(__dirname, '..', filePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);
};

router.get('/', async (req, res, next) => {
  try { res.json(await Certificate.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

// Download a certificate PDF by id
router.get('/:id/download', async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert?.file) return res.status(404).json({ message: 'No file uploaded' });
    const filePath = path.join(__dirname, '..', cert.file);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.setHeader('Content-Disposition', `attachment; filename="${cert.title || 'certificate'}.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (e) { next(e); }
});

router.post('/', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files?.image) data.image = `/uploads/certificates/${req.files.image[0].filename}`;
    if (req.files?.file) data.file = `/uploads/certificates/${req.files.file[0].filename}`;
    res.json(await Certificate.create(data));
  } catch (e) { next(e); }
});

router.put('/:id', auth, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'file', maxCount: 1 }]), async (req, res, next) => {
  try {
    const data = { ...req.body };
    const old = await Certificate.findById(req.params.id);
    if (req.files?.image) {
      deleteOldFile(old?.image);
      data.image = `/uploads/certificates/${req.files.image[0].filename}`;
    }
    if (req.files?.file) {
      deleteOldFile(old?.file);
      data.file = `/uploads/certificates/${req.files.file[0].filename}`;
    }
    res.json(await Certificate.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    deleteOldFile(cert?.image);
    deleteOldFile(cert?.file);
    await Certificate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
