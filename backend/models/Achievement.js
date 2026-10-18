const mongoose = require('mongoose');

const AchievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  icon: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Achievement', AchievementSchema);
