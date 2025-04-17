require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const journalRoutes = require('./routes/journal');
const profileRoutes = require('./routes/profile');
const aiCoachRoutes = require('./routes/aiCoach');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai-coach', aiCoachRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname,'frontend','ai_golf_coach','dist')));

// Handle client-side routing - serve index.html for specific routes
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

app.get('/forgot', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

// Fallback for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
});

// Sync database (simple approach for MVP)
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
