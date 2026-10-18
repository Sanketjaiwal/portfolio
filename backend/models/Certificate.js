const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  issuer: String,
  date: String,
  image: String,
  credentialUrl: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Certificate', CertificateSchema);
