import React, { useState } from 'react';
import { Search, Filter, Clock, Building2, TrendingUp, Wifi, WifiOff, Heart, Brain, Zap } from 'lucide-react';
import { SearchFilters } from '../types/patent';

interface SearchInterfaceProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  loading: boolean;
  serverStatus: 'checking' | 'online' | 'offline';
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({ 
  onSearch, 
  loading,
  serverStatus
}) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: 'all',
    assignee: '',
    marketPotential: 'all',
    sortBy: 'relevance',
    limit: 10
  });

  const handleSearch = () => {
    if (!query.trim()) {
      alert('Please enter a search query');
      return;
    }
    onSearch(query, filters);
  };

  const healthcareSuggestedQueries = [
    "AI-powered medical diagnostics",
    "CRISPR gene therapy applications",
    "telemedicine remote monitoring",
    "biomarker discovery platforms",
    "surgical robotics navigation",
    "personalized medicine algorithms",
    "drug delivery nanotechnology",
    "medical imaging enhancement",
    "wearable health sensors",
    "digital therapeutics platforms"
  ];

  const isOffline = serverStatus === 'offline';

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6">
          {/* Healthcare Focus Banner */}
          <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Heart className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900">Healthcare Patent Intelligence</h3>
                <p className="text-sm text-red-700">Discover breakthrough medical innovations with batch AI-powered commercialization insights</p>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-800">Batch AI Analysis</span>
                <Zap className="w-3 h-3 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Server Status Banner */}
          {isOffline && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Live search unavailable. Server is offline. Please check your connection.
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search healthcare patents: medical devices, diagnostics, therapeutics..."
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                disabled={isOffline}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || isOffline || !query.trim()}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              <span>{loading ? 'Batch Analyzing...' : 'Search'}</span>
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm">Advanced Filters</span>
            </button>
            
            <div className="flex items-center space-x-4 text-sm">
              {serverStatus === 'online' ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <Wifi className="w-4 h-4" />
                  <span>Live Healthcare Patent API</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-red-500">
                  <WifiOff className="w-4 h-4" />
                  <span>Offline Mode</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-purple-600">
                <Brain className="w-4 h-4" />
                <span>Batch AI Analysis</span>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isOffline}
                  >
                    <option value="all">All Time</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="last-2-years">Last 2 Years</option>
                    <option value="last-5-years">Last 5 Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building2 className="w-4 h-4 inline mr-1" />
                    Healthcare Organization
                  </label>
                  <input
                    type="text"
                    value={filters.assignee}
                    onChange={(e) => setFilters({...filters, assignee: e.target.value})}
                    placeholder="Hospital, pharma, medtech..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isOffline}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    Commercial Potential
                  </label>
                  <select
                    value={filters.marketPotential}
                    onChange={(e) => setFilters({...filters, marketPotential: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isOffline}
                  >
                    <option value="all">All Levels</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    disabled={isOffline}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="date">Filing Date</option>
                    <option value="commercialization">AI Score</option>
                    <option value="market-potential">Market Potential</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Results (Batch AI Analysis)
                </label>
                <select
                  value={filters.limit}
                  onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value)})}
                  className="w-32 p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isOffline}
                >
                  <option value={5}>5 results</option>
                  <option value={10}>10 results</option>
                  <option value={20}>20 results</option>
                  <option value={30}>30 results</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">All results analyzed simultaneously with AI</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Healthcare-Focused Suggested Queries */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Heart className="w-5 h-5 text-red-500 mr-2" />
          Popular Healthcare Innovation Topics
          <div className="ml-auto flex items-center space-x-2 px-3 py-1 bg-purple-100 rounded-full">
            <Brain className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-medium text-purple-800">Batch AI Ready</span>
          </div>
        </h3>
        <div className="flex flex-wrap gap-2">
          {healthcareSuggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setQuery(suggestion)}
              disabled={isOffline}
              className="px-4 py-2 bg-gradient-to-r from-red-50 to-pink-50 text-red-700 rounded-full hover:from-red-100 hover:to-pink-100 hover:text-red-800 transition-all duration-200 text-sm border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};