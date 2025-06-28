import express from 'express';

const router = express.Router();

export function createLLMRoutes(groqService) {
  router.post('/commercialization-strategy', async (req, res) => {
    try {
      const { patent } = req.body;
      
      if (!patent) {
        return res.status(400).json({ error: 'Healthcare patent data is required' });
      }

      console.log(`🧠 Generating healthcare commercialization strategy with Groq AI for: ${patent.publication_number}`);
      
      const strategy = await groqService.generateCommercializationStrategy(patent);
      
      res.json({
        success: true,
        patent_id: patent.publication_number,
        strategy: strategy,
        source: 'groq_ai',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Healthcare strategy generation error:', error);
      res.status(500).json({ error: 'Failed to generate healthcare strategy', message: error.message });
    }
  });

  return router;
}