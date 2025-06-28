import { useState } from 'react';
import { apiService } from '../services/api';
import { Patent, SearchFilters } from '../types/patent';

export const usePatentSearch = () => {
  const [searchResults, setSearchResults] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPatents = async (query: string, filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.searchPatents(query, filters);
      setSearchResults(response.patents || []);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to search patents. Please try again.';
      setError(errorMessage);
      setSearchResults([]);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults([]);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchPatents,
    clearResults,
    setError
  };
};