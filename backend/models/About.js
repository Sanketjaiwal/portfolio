const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  name: String,
  title: String,
  bio: String,
  avatar: String,
  photo: String,
  resume: String,
  email: String,
  phone: String,
  location: String,
});

module.exports = mongoose.model('About', AboutSchema);
