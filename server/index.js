// Load environment variables first, before any other imports
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import environment configuration
const { config, validateEnvironment } = require('./config/environment');

// Import services
const { GroqService } = require('./services/groqService');
const { PatentDatabase } = require('./services/patentDatabase');
const { PatentSearchService } = require('./services/patentSearchService');

// Import route creators
const { createLLMRoutes } = require('./routes/llmRoutes');
const { createPatentRoutes } = require('./routes/patentRoutes');
const { createStatisticsRoutes } = require('./routes/statisticsRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Validate environment variables (but don't exit on failure)
validateEnvironment();

// Initialize services
let groqService = null;
let patentDatabase = null;
let patentSearchService = null;

try {
  groqService = new GroqService();
  patentDatabase = new PatentDatabase();
  patentSearchService = new PatentSearchService(groqService, patentDatabase);
  console.log('✅ Services initialized successfully');
} catch (error) {
  console.warn('⚠️  Some services failed to initialize:', error.message);
  console.warn('API features may be limited');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));

// Routes
app.use('/api', healthRoutes);

// Only add routes if services are available
if (groqService && patentDatabase && patentSearchService) {
  app.use('/api', createPatentRoutes(patentSearchService, patentDatabase));
  app.use('/api/llm', createLLMRoutes(groqService));
  app.use('/api/statistics', createStatisticsRoutes(patentDatabase));
} else {
  // Fallback routes for when services are unavailable
  app.use('/api/search-patents', (req, res) => {
    res.status(503).json({ error: 'Patent search service unavailable', message: 'API keys not configured' });
  });
  app.use('/api/llm/*', (req, res) => {
    res.status(503).json({ error: 'AI service unavailable', message: 'Groq API key not configured' });
  });
  app.use('/api/statistics', (req, res) => {
    res.status(503).json({ error: 'Statistics service unavailable', message: 'Database not initialized' });
  });
}

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