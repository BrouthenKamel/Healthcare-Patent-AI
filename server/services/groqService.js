import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

export class GroqService {
  constructor() {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is required but not found in environment variables');
    }
    console.log('✅ Groq AI service initialized successfully');
  }

  async generateCompletion(messages, model = 'llama-3.3-70b-versatile') {
    if (!GROQ_API_KEY) {
      throw new Error('Groq API key not configured');
    }

    try {
      const response = await axios.post(GROQ_API_URL, {
        model: model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 4000, // Increased for batch processing
        top_p: 1,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('❌ Groq API Error:', error.response?.data || error.message);
      throw new Error(`Groq AI analysis failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  extractJsonFromResponse(response) {
    if (!response || typeof response !== 'string') {
      throw new Error('Invalid response format');
    }

    // Simple extraction: find first [ and last ]
    const firstBracket = response.indexOf('[');
    const lastBracket = response.lastIndexOf(']');
    
    if (firstBracket === -1 || lastBracket === -1 || lastBracket <= firstBracket) {
      throw new Error('No valid JSON array found in response');
    }
    
    return response.substring(firstBracket, lastBracket + 1);
  }

  // New batch analysis method for multiple patents
  async batchAnalyzePatentPotential(patents) {
    if (patents.length === 0) return [];

    // Prepare batch data for analysis
    const patentSummaries = patents.map((patent, index) => ({
      index: index,
      title: patent.title,
      abstract: patent.abstract.substring(0, 500), // Limit abstract length
      assignee: patent.assignee,
      keywords: patent.keywords?.slice(0, 3).join(', ') || 'N/A' // Limit keywords
    }));

    const prompt = `You are an expert healthcare patent analyst with deep knowledge of medical technology commercialization. Analyze the following ${patents.length} healthcare patents and provide commercialization scores (0-100) and market potential assessments for each.

Healthcare Patents to Analyze:
${patentSummaries.map(p => `
Patent ${p.index + 1}:
- Title: ${p.title}
- Abstract: ${p.abstract}
- Assignee: ${p.assignee}
- Keywords: ${p.keywords}
`).join('')}

Healthcare-Specific Analysis Factors:
1. Clinical utility and patient impact
2. Regulatory pathway complexity (FDA, CE, etc.)
3. Healthcare market size and adoption barriers
4. Reimbursement potential and payer acceptance
5. Clinical evidence requirements
6. Healthcare provider workflow integration
7. Patient safety and efficacy considerations
8. Competitive healthcare landscape
9. Technology readiness for clinical use
10. Healthcare economics and cost-effectiveness

CRITICAL: Respond ONLY with a valid JSON array containing exactly ${patents.length} objects. Each object must have this exact format:
[
  {
    "index": 0,
    "score": 85,
    "potential": "High",
    "reasoning": "Brief healthcare commercialization explanation"
  },
  {
    "index": 1,
    "score": 72,
    "potential": "Medium",
    "reasoning": "Brief healthcare commercialization explanation"
  }
]

Score ranges for healthcare patents:
- 90-100: Breakthrough medical technology with clear clinical benefit and strong commercial path
- 80-89: High healthcare impact with manageable regulatory and market challenges
- 70-79: Solid medical application with moderate commercialization barriers
- 60-69: Promising healthcare technology requiring significant development
- 50-59: Limited clinical utility or major regulatory/market obstacles
- Below 50: Poor healthcare commercialization prospects

Market potential options: "High", "Medium", "Low"

Focus on realistic healthcare market dynamics, regulatory requirements, and clinical adoption patterns. Remember: ONLY return the JSON array, no other text.`;

    const response = await this.generateCompletion([
      { role: 'user', content: prompt }
    ]);

    try {
      const jsonString = this.extractJsonFromResponse(response);
      const batchAnalysis = JSON.parse(jsonString);
      
      // Validate the response
      if (!Array.isArray(batchAnalysis) || batchAnalysis.length !== patents.length) {
        throw new Error(`Expected array of ${patents.length} analyses, got ${batchAnalysis.length}`);
      }

      // Validate each analysis
      const validatedAnalysis = batchAnalysis.map((analysis, index) => {
        if (typeof analysis.score !== 'number' || analysis.score < 0 || analysis.score > 100) {
          console.warn(`Invalid score for patent ${index}, using default`);
          analysis.score = 75;
        }
        
        if (!['High', 'Medium', 'Low'].includes(analysis.potential)) {
          console.warn(`Invalid potential for patent ${index}, using default`);
          analysis.potential = 'Medium';
        }

        return {
          score: Math.round(analysis.score),
          potential: analysis.potential,
          reasoning: analysis.reasoning || 'Healthcare analysis completed'
        };
      });

      return validatedAnalysis;
    } catch (parseError) {
      console.error('Failed to parse batch AI patent analysis:', parseError);
      console.error('Raw response:', response);
      throw new Error('AI batch analysis failed to provide valid healthcare assessment');
    }
  }

  // Keep the individual analysis method for single patent analysis
  async analyzePatentPotential(patent) {
    const batchResult = await this.batchAnalyzePatentPotential([patent]);
    return batchResult[0];
  }

  async generateCommercializationStrategy(patent) {
    const prompt = `You are an expert in healthcare patent commercialization and medical technology transfer with deep knowledge of the healthcare industry, regulatory pathways, and clinical adoption processes. Analyze the following healthcare patent and provide a comprehensive commercialization strategy.

Patent Information:
- Title: ${patent.title}
- Abstract: ${patent.abstract}
- Assignee: ${patent.assignee}
- Filing Date: ${patent.filing_date}
- Publication Number: ${patent.publication_number}
- AI Commercialization Score: ${patent.commercialization_score}/100
- Market Potential: ${patent.market_potential}

Healthcare Commercialization Context:
- Consider FDA regulatory pathways (510(k), PMA, De Novo)
- Analyze clinical evidence requirements and trial design
- Evaluate reimbursement landscape and payer dynamics
- Assess healthcare provider adoption barriers
- Consider patient safety and efficacy requirements
- Analyze healthcare economics and cost-effectiveness
- Evaluate competitive medical device/pharma landscape

CRITICAL: Respond ONLY with valid JSON. No explanatory text, markdown formatting, or additional commentary. Return only the JSON object below with realistic healthcare-focused insights:

{
  "use_cases": ["specific clinical use case 1", "specific healthcare application 2", "specific medical use case 3", "specific therapeutic application 4"],
  "market_analysis": "detailed healthcare market analysis including clinical need, market size, adoption barriers, and regulatory landscape",
  "investment_insights": ["healthcare investment insight 1", "clinical development funding insight 2", "regulatory pathway insight 3", "market access insight 4"],
  "commercialization_steps": ["clinical validation step with timeline", "regulatory submission step with timeline", "market access step with timeline", "commercial launch step with timeline"],
  "risk_assessment": "comprehensive healthcare risk analysis including clinical, regulatory, reimbursement, and adoption risks",
  "timeline": "realistic healthcare timeline to market (e.g., '3-5 years for medical devices')",
  "market_potential": "High",
  "estimated_investment": "realistic healthcare development funding needed",
  "competitive_landscape": "analysis of healthcare competition, clinical differentiation, and market positioning"
}

Focus on realistic healthcare commercialization insights based on current medical industry dynamics, regulatory requirements, and clinical adoption patterns. Remember: ONLY return the JSON object, no other text.`;

    const response = await this.generateCompletion([
      { role: 'user', content: prompt }
    ]);

    try {
      const firstBrace = response.indexOf('{');
      const lastBrace = response.lastIndexOf('}');
      
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        throw new Error('No valid JSON found in response');
      }
      
      const jsonString = response.substring(firstBrace, lastBrace + 1);
      const strategy = JSON.parse(jsonString);
      
      // Validate required fields
      const requiredFields = ['use_cases', 'market_analysis', 'investment_insights', 'commercialization_steps', 'risk_assessment', 'timeline', 'market_potential', 'estimated_investment', 'competitive_landscape'];
      
      for (const field of requiredFields) {
        if (!strategy[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      // Validate market_potential value
      if (!['High', 'Medium', 'Low'].includes(strategy.market_potential)) {
        strategy.market_potential = 'Medium'; // Default fallback
      }

      return strategy;
    } catch (parseError) {
      console.error('Failed to parse AI healthcare commercialization strategy:', parseError);
      console.error('Raw response:', response);
      throw new Error('AI failed to generate valid healthcare commercialization strategy');
    }
  }
}