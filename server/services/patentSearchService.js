import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SCRAPINGDOG_API_KEY = process.env.SCRAPINGDOG_API_KEY;
const SCRAPINGDOG_URL = "https://api.scrapingdog.com/google_patents";

export class PatentSearchService {
  constructor(groqService, patentDatabase) {
    this.groqService = groqService;
    this.patentDatabase = patentDatabase;
    
    if (!SCRAPINGDOG_API_KEY) {
      throw new Error('SCRAPINGDOG_API_KEY is required but not found in environment variables');
    }
  }

  // Helper function to extract healthcare-focused keywords
  extractKeywords(title, abstract) {
    const text = `${title} ${abstract}`.toLowerCase();
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'method', 'system', 'apparatus', 'device', 'comprising', 'including', 'wherein', 'said'];
    
    // Healthcare-specific important terms
    const healthcareTerms = ['medical', 'clinical', 'diagnostic', 'therapeutic', 'surgical', 'pharmaceutical', 'biomedical', 'healthcare', 'treatment', 'therapy', 'patient', 'hospital', 'doctor', 'nurse', 'medicine', 'drug', 'disease', 'condition', 'symptom', 'diagnosis', 'prognosis', 'intervention', 'procedure', 'monitoring', 'imaging', 'sensor', 'implant', 'prosthetic', 'rehabilitation', 'prevention'];
    
    const words = text.match(/\b[a-z]{3,}\b/g) || [];
    const wordCount = {};
    
    words.forEach(word => {
      if (!commonWords.includes(word)) {
        // Give higher weight to healthcare terms
        const weight = healthcareTerms.includes(word) ? 3 : 1;
        wordCount[word] = (wordCount[word] || 0) + weight;
      }
    });
    
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([word]) => word);
  }

  // Batch AI analysis for multiple patents
  async batchAnalyzePatents(patents) {
    if (patents.length === 0) return [];

    console.log(`🧠 Starting batch AI healthcare analysis for ${patents.length} patents...`);

    try {
      const batchAnalysis = await this.groqService.batchAnalyzePatentPotential(patents);
      
      // Apply the analysis results to each patent
      const analyzedPatents = patents.map((patent, index) => {
        const analysis = batchAnalysis[index] || { score: 75, potential: 'Medium' };
        
        return {
          ...patent,
          commercialization_score: analysis.score,
          market_potential: analysis.potential
        };
      });

      console.log(`✅ Batch AI healthcare analysis completed for ${patents.length} patents`);
      return analyzedPatents;

    } catch (error) {
      console.error('❌ Batch AI healthcare analysis failed:', error.message);
      
      // Fallback: assign default scores to avoid complete failure
      return patents.map(patent => ({
        ...patent,
        commercialization_score: 75,
        market_potential: 'Medium'
      }));
    }
  }

  // Enhanced healthcare patent search function with batch AI scoring
  async searchPatents(keyword = "medical device", numResults = 10) {
    try {
      // Enhance search query for healthcare focus
      const healthcareEnhancedQuery = `${keyword} medical healthcare diagnostic therapeutic clinical`;
      
      const params = {
        api_key: SCRAPINGDOG_API_KEY,
        query: healthcareEnhancedQuery,
        num: numResults.toString(),
        page: "0",
        sort: "new",
      };

      console.log(`🏥 Searching healthcare patents for: "${keyword}" (${numResults} results)`);
      
      const response = await axios.get(SCRAPINGDOG_URL, { params });

      if (response.status === 200) {
        const results = response.data.organic_results || [];
        
        // First, prepare all patents with basic data
        const patents = results.map(p => {
          const title = p.title || "N/A";
          const pubNum = p.publication_number || p.patent_id || "N/A";
          const abstract = p.snippet || "N/A";
          const filingDate = p.filing_date || "N/A";
          const assignee = p.assignee || "N/A";
          const inventor = p.inventor || "N/A";

          // Extract keywords from title and abstract
          const keywords = this.extractKeywords(title, abstract);

          return {
            publication_number: pubNum,
            title: title,
            abstract: abstract,
            filing_date: filingDate,
            assignee: assignee,
            inventor: inventor,
            keywords: keywords,
            ingested_at: new Date().toISOString()
          };
        });

        // Perform batch AI analysis on all patents at once
        const analyzedPatents = await this.batchAnalyzePatents(patents);

        // Add patents to database (with uniqueness check)
        const newPatentsCount = this.patentDatabase.addPatents(analyzedPatents);
        this.patentDatabase.addSearchHistory(keyword, analyzedPatents.length);

        console.log(`✅ Found ${analyzedPatents.length} healthcare patents, ${newPatentsCount} new additions to database`);
        return analyzedPatents;
      } else {
        throw new Error(`Healthcare Patent API Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Error searching healthcare patents:', error.message);
      throw error;
    }
  }
}