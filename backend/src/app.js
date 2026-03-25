const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const aiRoutes = require('./routes/aiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const contentRoutes = require('./routes/contentRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const contentProductionRoutes = require('./routes/contentProductionRoutes');
const marketingMetricsRoutes = require('./routes/marketingMetricsRoutes');
const contributionRoutes = require('./routes/contributionRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/content-production', contentProductionRoutes);
app.use('/api/marketing-metrics', marketingMetricsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    statusCode: 500,
    data: null,
    message: 'Internal server error',
    success: false
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    statusCode: 404,
    data: null,
    message: 'Route not found',
    success: false
  });
});

module.exports = app;
