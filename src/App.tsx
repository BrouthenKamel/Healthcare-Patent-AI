import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchInterface } from './components/SearchInterface';
import { PatentResults } from './components/PatentResults';
import { CommercializationAnalysis } from './components/CommercializationAnalysis';
import { DatabaseView } from './components/DatabaseView';
import { MarketInsights } from './components/MarketInsights';
import { usePatentSearch } from './hooks/usePatentSearch';
import { useServerStatus } from './hooks/useServerStatus';
import { apiService } from './services/api';
import { Patent, SearchFilters } from './types/patent';

function App() {
  const [activeTab, setActiveTab] = useState('search');
  const [selectedPatent, setSelectedPatent] = useState<Patent | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [commercializationStrategy, setCommercializationStrategy] = useState<any>(null);

  const { searchResults, loading, error, searchPatents, setError } = usePatentSearch();
  const { serverStatus } = useServerStatus();

  const handleSearch = async (query: string, filters: SearchFilters) => {
    if (serverStatus === 'offline') {
      setError('Server is offline. Please check your connection and try again.');
      return;
    }

    try {
      await searchPatents(query, filters);
    } catch (err) {
      // Error is already handled in the hook
    }
  };

  const handlePatentSelect = async (patent: Patent) => {
    setSelectedPatent(patent);
    setActiveTab('analysis');
    setAnalysisLoading(true);
    setCommercializationStrategy(null);
    
    if (serverStatus === 'offline') {
      setError('Server is offline. Cannot generate commercialization analysis.');
      setAnalysisLoading(false);
      return;
    }
    
    try {
      const response = await apiService.generateCommercializationStrategy(patent);
      if (response.success) {
        setCommercializationStrategy(response.strategy);
      }
    } catch (error: any) {
      setError('Failed to generate commercialization strategy: ' + error.message);
    } finally {
      setAnalysisLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-8">
            <SearchInterface 
              onSearch={handleSearch}
              loading={loading}
              serverStatus={serverStatus}
            />
            <PatentResults
              patents={searchResults}
              loading={loading}
              error={error}
              onPatentSelect={handlePatentSelect}
              selectedPatent={selectedPatent}
            />
          </div>
        );
      
      case 'analysis':
        return selectedPatent ? (
          <CommercializationAnalysis
            patent={selectedPatent}
            strategy={commercializationStrategy}
            loading={analysisLoading}
          />
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Patent Selected</h3>
            <p className="text-gray-600">Select a healthcare patent from the search results to generate AI-powered commercialization analysis.</p>
          </div>
        );
      
      case 'database':
        return <DatabaseView onPatentSelect={handlePatentSelect} />;
      
      case 'insights':
        return <MarketInsights />;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Server Status Indicator */}
      {serverStatus !== 'checking' && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-2 rounded-lg text-sm font-medium ${
          serverStatus === 'online' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              serverStatus === 'online' ? 'bg-green-500' : 'bg-red-500'
            } ${serverStatus === 'online' ? 'animate-pulse' : ''}`}></div>
            <span>
              {serverStatus === 'online' ? 'Live Healthcare APIs Active' : 'APIs Offline'}
            </span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="fixed top-32 right-4 z-50 max-w-md p-4 bg-red-100 border border-red-200 rounded-lg text-red-800">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-sm font-medium">Error</p>
              <p className="text-xs mt-1">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="text-xs underline mt-1 hover:no-underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>MedPatentAI Platform • Powered by ScrapingDog, Groq AI, and Live Healthcare Patent APIs</p>
            <p className="mt-1">© 2024 MedPatentAI. Built for healthcare patent discovery and commercialization insights.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;