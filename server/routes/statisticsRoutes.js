import express from 'express';

const router = express.Router();

export function createStatisticsRoutes(patentDatabase) {
  router.get('/', (req, res) => {
    try {
      const stats = patentDatabase.getStatistics();
      
      res.json({
        success: true,
        statistics: stats,
        search_history: patentDatabase.getSearchHistory(),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Healthcare statistics error:', error);
      res.status(500).json({ 
        error: 'Failed to get healthcare statistics', 
        message: error.message 
      });
    }
  });

  return router;
}