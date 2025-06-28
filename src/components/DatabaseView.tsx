import React, { useState, useEffect } from 'react';
import { PatentCard } from './PatentCard';
import { Patent } from '../types/patent';
import { apiService } from '../services/api';
import { 
  Database, 
  Filter, 
  Download, 
  BarChart3, 
  Calendar,
  Building2,
  TrendingUp,
  Search,
  RefreshCw,
  Heart
} from 'lucide-react';

interface DatabaseViewProps {
  onPatentSelect: (patent: Patent) => void;
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({ onPatentSelect }) => {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [filterBy, setFilterBy] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_patents: 0,
    per_page: 20
  });
  const [stats, setStats] = useState({
    total: 0,
    high_potential: 0,
    recent: 0,
    avg_score: 0
  });

  useEffect(() => {
    loadPatents();
  }, [currentPage, sortBy, filterBy, searchTerm]);

  const loadPatents = async () => {
    setLoading(true);
    try {
      const response = await apiService.getDatabasePatents({
        page: currentPage,
        limit: 20,
        sortBy,
        filterBy,
        search: searchTerm
      });

      if (response.success) {
        setPatents(response.patents);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to load patents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await apiService.getStatistics();
      if (response.success) {
        const statistics = response.statistics;
        setStats({
          total: statistics.totalPatents,
          high_potential: statistics.highPotential,
          recent: statistics.recentFilings,
          avg_score: statistics.averageScore
        });
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadPatents();
  };

  const handleRefresh = () => {
    loadPatents();
    loadStatistics();
  };

  if (loading && patents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Healthcare Patent Database...</h3>
          <p className="text-gray-600">Fetching medical patents with AI analysis</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Database Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Healthcare Patent Database</h2>
              <p className="text-gray-600 text-sm">Real-time medical patent collection with AI-powered clinical insights</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleRefresh}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Live Healthcare Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Healthcare Patents</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">{stats.total}</p>
            <p className="text-xs text-red-700">Live medical database</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">High Clinical Impact</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.high_potential}</p>
            <p className="text-xs text-green-700">AI-assessed</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">2024 Medical Filings</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">{stats.recent}</p>
            <p className="text-xs text-purple-700">Recent innovations</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Avg Clinical Score</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-1">{stats.avg_score}</p>
            <p className="text-xs text-orange-700">AI healthcare analysis</p>
          </div>
        </div>

        {/* Search and Filters */}
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search healthcare patents: medical devices, diagnostics, therapeutics..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="commercialization">Sort by AI Score</option>
            <option value="title">Sort by Title</option>
          </select>
          
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          >
            <option value="all">All Clinical Potential</option>
            <option value="high">High Clinical Impact</option>
            <option value="medium">Medium Clinical Impact</option>
            <option value="low">Low Clinical Impact</option>
          </select>

          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      {patents.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Healthcare Patents Found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or perform some medical patent searches to populate the database.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4">
            <p className="text-sm text-gray-600">
              Showing {patents.length} of {pagination.total_patents} healthcare patents 
              {loading && <span className="ml-2 text-red-600">• Updating...</span>}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {patents.map((patent) => (
              <PatentCard
                key={patent.publication_number}
                patent={patent}
                onSelect={onPatentSelect}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              <button 
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === page
                        ? 'bg-red-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button 
                onClick={() => setCurrentPage(Math.min(pagination.total_pages, currentPage + 1))}
                disabled={currentPage === pagination.total_pages}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Page {pagination.current_page} of {pagination.total_pages}
            </p>
          </div>
        </>
      )}
    </div>
  );
};