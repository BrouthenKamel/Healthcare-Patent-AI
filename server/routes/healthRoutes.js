const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Healthcare Patent Search API is running',
    services: {
      scrapingdog: 'active',
      groq: 'active',
      database: 'active'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;