import React from 'react';
import { Patent } from '../types/patent';
import { PatentCard } from './PatentCard';
import { Database, AlertCircle, Brain, Zap } from 'lucide-react';

interface PatentResultsProps {
  patents: Patent[];
  loading: boolean;
  error: string | null;
  onPatentSelect: (patent: Patent) => void;
  selectedPatent?: Patent;
}

export const PatentResults: React.FC<PatentResultsProps> = ({
  patents,
  loading,
  error,
  onPatentSelect,
  selectedPatent
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Searching Healthcare Patents...</h3>
          <p className="text-gray-600 mb-4">Analyzing patent databases and generating batch AI insights</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-purple-600">
            <Brain className="w-4 h-4" />
            <span>Batch AI Analysis with Groq LLaMA 3.3 70B</span>
            <Zap className="w-4 h-4" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">Search Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (patents.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Search</h3>
          <p className="text-gray-600">Enter a search query to discover healthcare patents and generate batch AI-powered commercialization insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Found {patents.length} healthcare patents
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Batch analyzed with AI for clinical commercialization potential
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-purple-600">
            <Brain className="w-4 h-4" />
            <span>Batch AI Analysis</span>
            <Zap className="w-4 h-4" />
          </div>
        </div>
        
        {/* AI Analysis Badge */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2 text-purple-800">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-medium">
              All {patents.length} patents analyzed simultaneously with Groq AI for efficient healthcare commercialization assessment
            </span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patents.map((patent) => (
          <PatentCard
            key={patent.publication_number}
            patent={patent}
            onSelect={onPatentSelect}
            selected={selectedPatent?.publication_number === patent.publication_number}
          />
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <button className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 border border-gray-300">
          Load More Results
        </button>
      </div>
    </div>
  );
};