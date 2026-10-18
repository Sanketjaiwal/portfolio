const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: String,
  year: String,
  grade: String,
  description: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Education', EducationSchema);
