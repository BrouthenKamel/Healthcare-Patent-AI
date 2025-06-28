// Load environment variables first, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const healthRoutes = require('./routes/healthRoutes');
const patentRoutes = require('./routes/patentRoutes');
const llmRoutes = require('./routes/llmRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

// Import environment configuration
const { config, validateEnvironment } = require('./config/environment');

const app = express();

// Validate environment variables (but don't exit on failure)
validateEnvironment();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api', healthRoutes);
app.use('/api', patentRoutes);
app.use('/api', llmRoutes);
app.use('/api', statisticsRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: config.nodeEnv === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  console.log(`Environment variables loaded:`, {
    GROQ_API_KEY: process.env.GROQ_API_KEY ? 'Set' : 'Not set',
    SCRAPINGDOG_API_KEY: process.env.SCRAPINGDOG_API_KEY ? 'Set' : 'Not set'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});