import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Building2, Calendar, Award, Globe, DollarSign, RefreshCw, Heart } from 'lucide-react';
import { apiService } from '../services/api';

export const MarketInsights: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getStatistics();
      if (response.success) {
        setStatistics(response.statistics);
      } else {
        setError('Failed to load healthcare market statistics');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load healthcare market insights');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-600 border-t-transparent mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Healthcare Market Insights...</h3>
          <p className="text-gray-600">Analyzing live medical patent data with AI</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-red-200 p-12">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Healthcare Insights</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadStatistics}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12">
        <div className="text-center">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Healthcare Data Available</h3>
          <p className="text-gray-600">Perform some medical patent searches to generate healthcare market insights</p>
        </div>
      </div>
    );
  }

  const commercializationData = [
    { name: 'High Clinical Impact', value: statistics.highPotential, color: '#DC2626' },
    { name: 'Medium Clinical Impact', value: statistics.mediumPotential, color: '#F59E0B' },
    { name: 'Low Clinical Impact', value: statistics.lowPotential, color: '#6B7280' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Live Healthcare Market Insights</h2>
              <p className="text-gray-600 text-sm">Real-time analysis of medical patent trends and clinical commercialization opportunities</p>
            </div>
          </div>
          <button 
            onClick={loadStatistics}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {/* Key Healthcare Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Medical Patents</span>
            </div>
            <p className="text-2xl font-bold text-red-900 mt-1">{statistics.totalPatents}</p>
            <p className="text-xs text-red-700">Live healthcare database</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">High Clinical Impact</span>
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{statistics.highPotential}</p>
            <p className="text-xs text-green-700">AI-assessed medical patents</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Avg Clinical Score</span>
            </div>
            <p className="text-2xl font-bold text-purple-900 mt-1">{statistics.averageScore}</p>
            <p className="text-xs text-purple-700">AI healthcare analysis</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Recent Medical Filings</span>
            </div>
            <p className="text-2xl font-bold text-orange-900 mt-1">{statistics.recentFilings}</p>
            <p className="text-xs text-orange-700">2024 healthcare patents</p>
          </div>
        </div>
      </div>

      {/* Healthcare Technology Trends */}
      {statistics.technologyTrends && statistics.technologyTrends.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 text-red-500 mr-2" />
            Healthcare Technology Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statistics.technologyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="patents" fill="url(#healthcareGradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="healthcareGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DC2626" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Clinical Impact Distribution */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 text-red-500 mr-2" />
            AI Clinical Impact Assessment
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={commercializationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {commercializationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Medical Patent Filings Timeline */}
        {statistics.monthlyFilings && statistics.monthlyFilings.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Patent Filings Timeline</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={statistics.monthlyFilings}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="filings" 
                    stroke="#DC2626" 
                    strokeWidth={3}
                    dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Top Healthcare Organizations */}
      {statistics.topAssignees && statistics.topAssignees.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building2 className="w-5 h-5 text-red-500 mr-2" />
            Top Healthcare Patent Assignees
          </h3>
          <div className="space-y-4">
            {statistics.topAssignees.slice(0, 5).map((assignee: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{assignee.name}</h4>
                    <p className="text-sm text-gray-600">{assignee.patents} medical patents in database</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{assignee.patents}</p>
                  <p className="text-xs text-gray-500">Healthcare patents</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Healthcare Insights */}
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-lg border border-red-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-red-900">Live AI-Generated Healthcare Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">🏥 Clinical Database Growth</h4>
            <p className="text-red-800 text-sm">
              {statistics.totalPatents} healthcare patents analyzed with {statistics.averageScore} average clinical impact score. 
              {Math.round((statistics.highPotential / statistics.totalPatents) * 100)}% show high clinical commercialization potential.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">🧠 AI Clinical Analysis</h4>
            <p className="text-red-800 text-sm">
              Groq AI has evaluated {statistics.totalPatents} medical patents for clinical impact and market potential, 
              with {statistics.highPotential} receiving high healthcare commercialization scores.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">🔬 Recent Medical Innovation</h4>
            <p className="text-red-800 text-sm">
              {statistics.recentFilings} medical patents filed in 2024 are now in the database, 
              representing the latest healthcare innovations and clinical opportunities.
            </p>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-red-200">
            <h4 className="font-semibold text-red-900 mb-2">📊 Live Healthcare Updates</h4>
            <p className="text-red-800 text-sm">
              Database grows with each medical patent search. All clinical insights and market analysis 
              are generated in real-time from live healthcare patent data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};