export interface Patent {
  publication_number: string;
  title: string;
  abstract: string;
  filing_date: string;
  assignee: string;
  inventor: string;
  keywords?: string[];
  commercialization_score?: number;
  market_potential?: 'High' | 'Medium' | 'Low';
  ingested_at?: string;
}

export interface CommercializationStrategy {
  use_cases: string[];
  market_analysis: string;
  investment_insights: string[];
  commercialization_steps: string[];
  risk_assessment: string;
  timeline: string;
  market_potential?: string;
  estimated_investment?: string;
  competitive_landscape?: string;
}

export interface SearchFilters {
  dateRange: string;
  assignee: string;
  marketPotential: string;
  sortBy: string;
  limit?: number;
}

export interface DatabaseStatistics {
  totalPatents: number;
  highPotential: number;
  mediumPotential: number;
  lowPotential: number;
  averageScore: number;
  recentFilings: number;
  topAssignees: Array<{ name: string; patents: number }>;
  technologyTrends: Array<{ name: string; patents: number; growth: number }>;
  monthlyFilings: Array<{ month: string; filings: number }>;
}