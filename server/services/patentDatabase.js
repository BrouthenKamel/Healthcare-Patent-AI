class PatentDatabase {
  constructor() {
    this.patents = new Map(); // Using Map for O(1) lookups by publication_number
    this.searchHistory = [];
    this.statistics = {
      totalPatents: 0,
      highPotential: 0,
      mediumPotential: 0,
      lowPotential: 0,
      averageScore: 0,
      recentFilings: 0,
      topAssignees: new Map(),
      technologyTrends: new Map(),
      monthlyFilings: new Map()
    };
  }

  // Add patent with uniqueness check
  addPatent(patent) {
    const key = patent.publication_number;
    if (!this.patents.has(key)) {
      this.patents.set(key, patent);
      this.updateStatistics(patent);
      console.log(`🏥 Added new healthcare patent to database: ${key}`);
      return true;
    }
    return false; // Patent already exists
  }

  // Add multiple patents
  addPatents(patents) {
    let newCount = 0;
    patents.forEach(patent => {
      if (this.addPatent(patent)) {
        newCount++;
      }
    });
    console.log(`🏥 Added ${newCount} new healthcare patents to database (${patents.length - newCount} duplicates skipped)`);
    return newCount;
  }

  // Update statistics when adding a patent
  updateStatistics(patent) {
    this.statistics.totalPatents = this.patents.size;
    
    // Clinical impact counts
    if (patent.market_potential === 'High') this.statistics.highPotential++;
    else if (patent.market_potential === 'Medium') this.statistics.mediumPotential++;
    else if (patent.market_potential === 'Low') this.statistics.lowPotential++;

    // Average clinical score
    const scores = Array.from(this.patents.values())
      .map(p => p.commercialization_score || 0)
      .filter(score => score > 0);
    this.statistics.averageScore = scores.length > 0 
      ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
      : 0;

    // Recent medical filings (2024)
    this.statistics.recentFilings = Array.from(this.patents.values())
      .filter(p => new Date(p.filing_date).getFullYear() === 2024).length;

    // Top healthcare assignees
    const assignee = patent.assignee;
    if (assignee && assignee !== 'N/A') {
      this.statistics.topAssignees.set(
        assignee, 
        (this.statistics.topAssignees.get(assignee) || 0) + 1
      );
    }

    // Healthcare technology trends (based on keywords)
    if (patent.keywords) {
      patent.keywords.forEach(keyword => {
        // Focus on healthcare-related keywords
        const healthcareKeywords = ['medical', 'diagnostic', 'therapeutic', 'clinical', 'surgical', 'pharmaceutical', 'biomedical', 'healthcare', 'treatment', 'therapy', 'device', 'implant', 'monitoring', 'imaging'];
        if (healthcareKeywords.some(hk => keyword.toLowerCase().includes(hk))) {
          this.statistics.technologyTrends.set(
            keyword,
            (this.statistics.technologyTrends.get(keyword) || 0) + 1
          );
        }
      });
    }

    // Monthly medical filings
    const filingDate = new Date(patent.filing_date);
    if (!isNaN(filingDate.getTime())) {
      const monthKey = `${filingDate.getFullYear()}-${String(filingDate.getMonth() + 1).padStart(2, '0')}`;
      this.statistics.monthlyFilings.set(
        monthKey,
        (this.statistics.monthlyFilings.get(monthKey) || 0) + 1
      );
    }
  }

  // Get all patents
  getAllPatents() {
    return Array.from(this.patents.values());
  }

  // Get patents with filters
  getPatents(filters = {}) {
    let patents = Array.from(this.patents.values());

    if (filters.assignee) {
      patents = patents.filter(p => 
        p.assignee.toLowerCase().includes(filters.assignee.toLowerCase())
      );
    }

    if (filters.marketPotential && filters.marketPotential !== 'all') {
      patents = patents.filter(p => 
        p.market_potential?.toLowerCase() === filters.marketPotential.toLowerCase()
      );
    }

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      patents = patents.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.abstract.toLowerCase().includes(term) ||
        p.assignee.toLowerCase().includes(term)
      );
    }

    // Sort patents
    if (filters.sortBy) {
      patents.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date':
            return new Date(b.filing_date) - new Date(a.filing_date);
          case 'commercialization':
            return (b.commercialization_score || 0) - (a.commercialization_score || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
    }

    return patents;
  }

  // Get healthcare statistics
  getStatistics() {
    return {
      ...this.statistics,
      topAssignees: Array.from(this.statistics.topAssignees.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, patents: count })),
      technologyTrends: Array.from(this.statistics.technologyTrends.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([name, count]) => ({ name, patents: count, growth: Math.random() * 30 + 5 })),
      monthlyFilings: Array.from(this.statistics.monthlyFilings.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-12) // Last 12 months
        .map(([month, count]) => ({ month, filings: count }))
    };
  }

  // Add search to history
  addSearchHistory(query, resultCount) {
    this.searchHistory.push({
      query,
      resultCount,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 100 searches
    if (this.searchHistory.length > 100) {
      this.searchHistory = this.searchHistory.slice(-100);
    }
  }

  // Get search history
  getSearchHistory() {
    return this.searchHistory.slice(-10); // Last 10 searches
  }
}

module.exports = { PatentDatabase };