import express from 'express';
import cors from 'cors';
import { config, validateEnvironment } from './config/environment.js';
import { GroqService } from './services/groqService.js';
import { PatentDatabase } from './services/patentDatabase.js';
import { PatentSearchService } from './services/patentSearchService.js';
import { createHealthRoutes } from './routes/healthRoutes.js';
import { createPatentRoutes } from './routes/patentRoutes.js';
import { createStatisticsRoutes } from './routes/statisticsRoutes.js';
import { createLLMRoutes } from './routes/llmRoutes.js';

// Validate environment variables
validateEnvironment();

const app = express();

// Debug environment variables
console.log('🔍 Environment Variables Debug:');
console.log('- NODE_ENV:', config.nodeEnv);
console.log('- GROQ_API_KEY exists:', !!config.groqApiKey);
console.log('- SCRAPINGDOG_API_KEY exists:', !!config.scrapingdogApiKey);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize services
const groqService = new GroqService();
const patentDatabase = new PatentDatabase();
const patentSearchService = new PatentSearchService(groqService, patentDatabase);

// Routes
app.use('/api/health', createHealthRoutes(patentDatabase));
app.use('/api', createPatentRoutes(patentSearchService, patentDatabase));
app.use('/api/statistics', createStatisticsRoutes(patentDatabase));
app.use('/api/llm', createLLMRoutes(groqService));

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('💥 Healthcare server error:', error);
  res.status(500).json({ error: 'Internal healthcare server error' });
});

app.listen(config.port, () => {
  console.log(`🏥 Healthcare Patent Search API server running on port ${config.port}`);
  console.log(`📡 ScrapingDog API integration: ACTIVE`);
  console.log(`🧠 Groq AI healthcare integration: ACTIVE`);
  console.log(`💾 Healthcare in-memory database: ACTIVE`);
  console.log(`🔍 Ready to search healthcare patents and generate AI clinical insights!`);
});