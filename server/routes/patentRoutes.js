const express = require('express');

const router = express.Router();

function createPatentRoutes(patentSearchService, patentDatabase) {
  router.post('/search-patents', async (req, res) => {
    try {
      const { query, filters = {} } = req.body;
      
      if (!query || query.trim() === '') {
        return res.status(400).json({ error: 'Healthcare search query is required' });
      }

      const numResults = Math.min(filters.limit || 10, 50); // Cap at 50 results
      const patents = await patentSearchService.searchPatents(query, numResults);
      
      // Apply filters
      let filteredPatents = patents;
      
      if (filters.assignee) {
        filteredPatents = filteredPatents.filter(p => 
          p.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
        );
      }
      
      if (filters.marketPotential && filters.marketPotential !== 'all') {
        filteredPatents = filteredPatents.filter(p => 
          p.market_potential.toLowerCase() === filters.marketPotential.toLowerCase()
        );
      }
      
      // Sort results
      if (filters.sortBy) {
        filteredPatents.sort((a, b) => {
          switch (filters.sortBy) {
            case 'date':
              return new Date(b.filing_date) - new Date(a.filing_date);
            case 'commercialization':
              return b.commercialization_score - a.commercialization_score;
            case 'title':
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });
      }

      res.json({
        success: true,
        query: query,
        total: filteredPatents.length,
        patents: filteredPatents,
        database_total: patentDatabase.getStatistics().totalPatents,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Healthcare search error:', error);
      res.status(500).json({ 
        error: 'Failed to search healthcare patents', 
        message: error.message 
      });
    }
  });

  router.get('/database/patents', (req, res) => {
    try {
      const { page = 1, limit = 20, sortBy = 'date', filterBy = 'all', search = '' } = req.query;
      
      const filters = {
        sortBy,
        marketPotential: filterBy,
        searchTerm: search
      };
      
      const allPatents = patentDatabase.getPatents(filters);
      
      // Pagination
      const startIndex = (parseInt(page) - 1) * parseInt(limit);
      const endIndex = startIndex + parseInt(limit);
      const paginatedPatents = allPatents.slice(startIndex, endIndex);
      
      res.json({
        success: true,
        patents: paginatedPatents,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(allPatents.length / parseInt(limit)),
          total_patents: allPatents.length,
          per_page: parseInt(limit)
        },
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('❌ Healthcare database query error:', error);
      res.status(500).json({ 
        error: 'Failed to query healthcare database', 
        message: error.message 
      });
    }
  });

  return router;
}

module.exports = { createPatentRoutes };