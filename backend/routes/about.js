const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const About = require('../models/About');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/about');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, /image\/(jpeg|jpg|png|webp|gif)/.test(file.mimetype));
    } else if (file.fieldname === 'resume') {
      cb(null, file.mimetype === 'application/pdf');
    } else {
      cb(null, false);
    }
  },
});

const deleteOldFile = (filePath) => {
  if (!filePath) return;
  const full = path.join(__dirname, '..', filePath);
  if (fs.existsSync(full)) fs.unlinkSync(full);
};

router.get('/', async (req, res, next) => {
  try { res.json(await About.findOne()); } catch (e) { next(e); }
});

router.get('/download-resume', async (req, res, next) => {
  try {
    const about = await About.findOne();
    if (!about?.resume) return res.status(404).json({ message: 'No resume uploaded' });
    const filePath = path.join(__dirname, '..', about.resume);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    res.setHeader('Content-Disposition', `attachment; filename="resume.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    res.sendFile(filePath);
  } catch (e) { next(e); }
});

router.put('/', auth, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), async (req, res, next) => {
  try {
    const data = { ...req.body };
    const existing = await About.findOne();

    if (req.files?.avatar) {
      deleteOldFile(existing?.avatar);
      data.avatar = `/uploads/about/${req.files.avatar[0].filename}`;
    }
    if (req.files?.resume) {
      deleteOldFile(existing?.resume);
      data.resume = `/uploads/about/${req.files.resume[0].filename}`;
    }

    const about = await About.findOneAndUpdate({}, data, { upsert: true, new: true });
    res.json(about);
  } catch (e) { next(e); }
});

module.exports = router;
