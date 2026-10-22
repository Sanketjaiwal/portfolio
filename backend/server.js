require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/about', require('./routes/about'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/certificates', require('./routes/certificates'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/education', require('./routes/education'));
app.use('/api/social', require('./routes/social'));
app.use('/api/skills', require('./routes/skills'));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ message: 'Server error' });
});

const seedAdmin = async () => {
  const Admin = require('./models/Admin');
  const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!exists) {
    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await Admin.create({ email: process.env.ADMIN_EMAIL, password: hashed });
    console.log('Admin created:', process.env.ADMIN_EMAIL);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    seedAdmin();
    app.listen(process.env.PORT || 5000, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT || 5000}`));
  })
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
