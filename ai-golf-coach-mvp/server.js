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
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_BASE_URL 
    : 'http://localhost:5173',
  credentials: true
}));
app.use(bodyParser.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/ai-coach', aiCoachRoutes);

// Serve static frontend files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'frontend','ai_golf_coach','dist')));

  // Handle client-side routing - serve index.html for specific routes
  const routes = ['/login', '/register', '/forgot', '/reset', '/home', '/profile', '/'];
  routes.forEach(route => {
    app.get(route, (req, res) => {
      res.sendFile(path.join(__dirname, 'frontend', 'ai_golf_coach', 'dist', 'index.html'));
    });
  });
}

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Sync database (simple approach for MVP)
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
