import React from 'react';
import { Patent } from '../types/patent';
import { 
  Lightbulb, 
  Target, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  TrendingUp,
  CheckCircle,
  Clock,
  Brain,
  Zap
} from 'lucide-react';

interface CommercializationAnalysisProps {
  patent: Patent;
  strategy: any;
  loading: boolean;
}

export const CommercializationAnalysis: React.FC<CommercializationAnalysisProps> = ({
  patent,
  strategy,
  loading
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating AI Analysis...</h3>
          <p className="text-gray-600">Analyzing commercialization potential with Groq AI</p>
          <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-purple-600">
            <Brain className="w-4 h-4" />
            <span>Powered by LLaMA 3.3 70B</span>
          </div>
        </div>
      </div>
    );
  }

  if (!strategy) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Unavailable</h3>
          <p className="text-gray-600">Unable to generate commercialization strategy. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Patent Overview */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">AI Commercialization Analysis</h2>
        <h3 className="text-lg font-semibold text-blue-900 mb-2">{patent.title}</h3>
        <p className="text-blue-800 text-sm">{patent.publication_number} • Filed: {patent.filing_date}</p>
        
        {/* Market Potential Badge */}
        {strategy.market_potential && (
          <div className="mt-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              strategy.market_potential === 'High' ? 'bg-green-100 text-green-800' :
              strategy.market_potential === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {strategy.market_potential} Market Potential
            </span>
          </div>
        )}
      </div>

      {/* Key Metrics */}
      {(strategy.estimated_investment || strategy.timeline) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategy.estimated_investment && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Investment Required</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">{strategy.estimated_investment}</p>
            </div>
          )}
          
          {strategy.timeline && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Time to Market</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">{strategy.timeline}</p>
            </div>
          )}
        </div>
      )}

      {/* Use Cases */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Potential Use Cases</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategy.use_cases.map((useCase, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-green-800">{useCase}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Market Analysis</h3>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-blue-900">{strategy.market_analysis}</p>
        </div>
      </div>

      {/* Investment Insights */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Investment Insights</h3>
        </div>
        <div className="space-y-3">
          {strategy.investment_insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <Target className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <span className="text-purple-800">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Commercialization Roadmap */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Commercialization Roadmap</h3>
        </div>
        <div className="space-y-4">
          {strategy.commercialization_steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 pb-4">
                <p className="text-gray-800">{step}</p>
                {index < strategy.commercialization_steps.length - 1 && (
                  <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent ml-4 mt-2"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment & Competitive Landscape */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Risk Assessment</h3>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <p className="text-yellow-800">{strategy.risk_assessment}</p>
          </div>
        </div>

        {strategy.competitive_landscape && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Competitive Landscape</h3>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <p className="text-indigo-800">{strategy.competitive_landscape}</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Powered Badge */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full border border-purple-200">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">Powered by Groq AI • LLaMA 3.3 70B • Real-time Analysis</span>
        </div>
      </div>
    </div>
  );
};