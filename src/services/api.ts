import { ApiService } from './apiService.js';

export interface SearchFilters {
  dateRange?: string;
  assignee?: string;
  marketPotential?: string;
  sortBy?: string;
  limit?: number;
}

export interface DatabaseFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  filterBy?: string;
  search?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PatentSearchResponse {
  success: boolean;
  query: string;
  total: number;
  patents: any[];
  database_total: number;
}

export interface DatabasePagination {
  current_page: number;
  total_pages: number;
  total_patents: number;
  per_page: number;
}

export interface DatabaseResponse {
  success: boolean;
  patents: any[];
  pagination: DatabasePagination;
}

export interface StatisticsResponse {
  success: boolean;
  statistics: any;
  search_history: any[];
}

export interface CommercializationStrategyResponse {
  success: boolean;
  patent_id: string;
  strategy: any;
}

export const apiService = new ApiService();