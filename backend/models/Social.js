const mongoose = require('mongoose');

const SocialSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: String,
});

module.exports = mongoose.model('Social', SocialSchema);
