const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, min: 0, max: 100 },
  category: String,
});

module.exports = mongoose.model('Skill', SkillSchema);
