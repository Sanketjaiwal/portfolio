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

app.get("/", (req, res) => {
  res.send("Backend is running successfully!");
});

const seedAdmin = async () => {
  const Admin = require('./models/Admin');
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be configured');
  }

  const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const admin = await Admin.findOne({ email: new RegExp(`^${escapedEmail}$`, 'i') });
  const hashed = await bcrypt.hash(password, 10);

  if (admin) {
    admin.email = email;
    admin.password = hashed;
    await admin.save();
  } else {
    await Admin.create({ email, password: hashed });
  }
  console.log('Admin credentials synchronized from environment');
};

const startServer = async () => {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    throw new Error('MONGO_URI and JWT_SECRET must be configured');
  }

  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
  await seedAdmin();
  app.listen(process.env.PORT || 5000, '0.0.0.0', () => console.log(`Server running on port ${process.env.PORT || 5000}`));
};

startServer().catch(err => {
    console.error('Server startup failed:', err.message);
    process.exit(1);
  });
