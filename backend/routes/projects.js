const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/projects');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

const handleUpload = (req, res, next) => {
  upload.single('video')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

router.get('/', async (req, res, next) => {
  try { res.json(await Project.find().sort({ createdAt: -1 })); } catch (e) { next(e); }
});

router.post('/', auth, handleUpload, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.body.techStack) data.techStack = JSON.parse(req.body.techStack);
    if (req.file) data.demoVideoUrl = `/uploads/projects/${req.file.filename}`;
    res.json(await Project.create(data));
  } catch (e) { next(e); }
});

router.put('/:id', auth, handleUpload, async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.body.techStack) data.techStack = JSON.parse(req.body.techStack);
    if (req.file) {
      const old = await Project.findById(req.params.id);
      if (old?.demoVideoUrl) {
        const oldPath = path.join(__dirname, '..', old.demoVideoUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      data.demoVideoUrl = `/uploads/projects/${req.file.filename}`;
    }
    res.json(await Project.findByIdAndUpdate(req.params.id, data, { new: true }));
  } catch (e) { next(e); }
});

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project?.demoVideoUrl) {
      const filePath = path.join(__dirname, '..', project.demoVideoUrl);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { next(e); }
});

module.exports = router;
