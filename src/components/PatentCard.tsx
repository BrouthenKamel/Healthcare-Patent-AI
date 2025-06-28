import React from 'react';
import { Calendar, Building2, User, Lightbulb, TrendingUp, Star } from 'lucide-react';
import { Patent } from '../types/patent';

interface PatentCardProps {
  patent: Patent;
  onSelect: (patent: Patent) => void;
  selected?: boolean;
}

export const PatentCard: React.FC<PatentCardProps> = ({ patent, onSelect, selected }) => {
  const getMarketPotentialColor = (potential: string) => {
    switch (potential) {
      case 'High': return 'text-green-700 bg-green-100';
      case 'Medium': return 'text-yellow-700 bg-yellow-100';
      case 'Low': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getCommercializationScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-700 bg-green-100';
    if (score >= 70) return 'text-blue-700 bg-blue-100';
    if (score >= 50) return 'text-yellow-700 bg-yellow-100';
    return 'text-red-700 bg-red-100';
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border transition-all duration-200 hover:shadow-xl cursor-pointer ${
        selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={() => onSelect(patent)}
    >
      <div className="p-6">
        {/* Header with title and scores */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {patent.title}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{new Date(patent.filing_date).toLocaleDateString()}</span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-blue-600">{patent.publication_number}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2 ml-4">
            {patent.commercialization_score && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getCommercializationScoreColor(patent.commercialization_score)}`}>
                <Star className="w-3 h-3 inline mr-1" />
                {patent.commercialization_score}/100
              </div>
            )}
            {patent.market_potential && (
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getMarketPotentialColor(patent.market_potential)}`}>
                <TrendingUp className="w-3 h-3 inline mr-1" />
                {patent.market_potential} Potential
              </div>
            )}
          </div>
        </div>

        {/* Abstract */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3">
          {patent.abstract}
        </p>

        {/* Metadata */}
        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">Assignee:</span>
            <span className="ml-1 text-blue-600">{patent.assignee}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">Inventor:</span>
            <span className="ml-1">{patent.inventor}</span>
          </div>
        </div>

        {/* Keywords */}
        {patent.keywords && patent.keywords.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {patent.keywords.slice(0, 4).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 text-xs rounded-md border border-blue-200"
                >
                  {keyword}
                </span>
              ))}
              {patent.keywords.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{patent.keywords.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action hint */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <Lightbulb className="w-3 h-3 mr-1" />
              <span>Click for AI commercialization analysis</span>
            </div>
            {selected && (
              <div className="text-xs text-blue-600 font-medium">
                Selected for analysis
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};