# 🚀 MERN Portfolio Website

A full-stack portfolio website with admin dashboard to manage all content.

## Features
- **Public Portfolio**: Hero, Projects, Certificates, Achievements, Education, Skills, Social Links
- **Admin Dashboard**: Login-protected panel to add/edit/delete everything
- **Dark Theme**: Modern glassmorphism design with purple/cyan gradient

## Setup

### Prerequisites
- Node.js installed
- MongoDB running locally (`mongod`)

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env if needed (default: admin@portfolio.com / admin123)
node server.js
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Or use the startup script (Windows):
```
Double-click start.bat
```

## URLs
- Portfolio: http://localhost:3000
- Admin Login: http://localhost:3000/login
- Backend API: http://localhost:5000/api

## Default Admin Credentials
- Email: `admin@portfolio.com`
- Password: `admin123`

> ⚠️ Change these in `backend/.env` before deploying!

## Admin Sections
| Section | What you can manage |
|---------|-------------------|
| About | Name, title, bio, avatar, resume, contact |
| Projects | Title, description, image, tech stack, links |
| Certificates | Title, issuer, date, image, credential URL |
| Achievements | Title, description, date, emoji icon |
| Education | Degree, institution, year, grade |
| Social Links | Platform + URL (GitHub, LinkedIn, etc.) |
| Skills | Name, category, proficiency % |
