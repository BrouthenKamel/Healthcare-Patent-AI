import express from 'express';

const router = express.Router();

export function createHealthRoutes(patentDatabase) {
  router.get('/', (req, res) => {
    const stats = patentDatabase.getStatistics();
    
    res.json({ 
      status: 'OK', 
      message: 'Healthcare Patent Search API is running',
      services: {
        scrapingdog: 'active',
        groq: 'active',
        database: 'active'
      },
      database_stats: {
        total_healthcare_patents: stats.totalPatents,
        high_clinical_impact: stats.highPotential,
        recent_medical_searches: patentDatabase.getSearchHistory().length
      },
      timestamp: new Date().toISOString()
    });
  });

  return router;
}