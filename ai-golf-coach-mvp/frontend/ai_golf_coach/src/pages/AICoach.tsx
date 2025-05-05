import { useState, FormEvent, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

// Define options matching backend logic/UI needs
const focusAreaOptions = [
    'Overall', 'Driving', 'Irons', 'Swing', 'Short Game', 'Chipping', 'Pitching', 'Bunkers', 'Putting', 'Mental Game', 'Course Management'
];
const adviceTypeOptions = [
    'Practice Drills', 'Swing Thoughts', 'Practice Plan', 'Mental Strategy', 'Analyze Performance', 'Quick Tip'
];

// Interface for the response object from POST /generate
interface AIRecommendationResponse {
    id: string;
    userId: string;
    focusArea: string;
    adviceType: string;
    recommendations: string;
    createdAt: string;
}

// Group focus areas by category
const gameCategories = {
    'Full Swing': ['Driving', 'Irons', 'Swing'],
    'Short Game': ['Short Game', 'Chipping', 'Pitching', 'Bunkers'],
    'Putting': ['Putting'],
    'Mental Game': ['Mental Game', 'Course Management'],
    'Overall': ['Overall']
};

export default function AICoach() {
  const { token, logout } = useAuth();
  const [focusArea, setFocusArea] = useState<string>(focusAreaOptions[0]);
  const [adviceType, setAdviceType] = useState<string>(adviceTypeOptions[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<AIRecommendationResponse | null>(null);
  const [history, setHistory] = useState<AIRecommendationResponse[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('Full Swing');

  useEffect(() => {
    // Fetch initial history
    fetch('/api/ai-coach/history', { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(res => res.ok ? res.json() : [])
      .then(data => setHistory(data))
      .catch(err => console.error("Failed to fetch history"));
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setRecommendation(null);

    try {
      const res = await fetch('/api/ai-coach/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ focusArea, adviceType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to get recommendation');
      }

      setRecommendation(data);
      setHistory(prev => [data, ...prev]);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Group recommendations by focus area
  const groupedRecommendations = history.reduce((acc, rec) => {
    const category = Object.entries(gameCategories).find(([_, areas]) => 
      areas.includes(rec.focusArea)
    )?.[0] || 'Overall';
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(rec);
    return acc;
  }, {} as Record<string, AIRecommendationResponse[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Golf Coach</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            <Link to="/ai-coach" className="font-semibold text-indigo-600">AI Coach</Link>
          </nav>
        </div>
        <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Request Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-xl font-semibold mb-6">Get Coaching Advice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
                <select
                  id="focusArea"
                  name="focusArea"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  {focusAreaOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="adviceType" className="block text-sm font-medium text-gray-700 mb-1">Type of Advice</label>
                <select
                  id="adviceType"
                  name="adviceType"
                  value={adviceType}
                  onChange={(e) => setAdviceType(e.target.value)}
                  disabled={isLoading}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  {adviceTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
              >
                {isLoading ? 'Generating...' : 'Get Advice'}
              </button>
            </form>
          </div>

          {/* Recommendations Display Area */}
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Your AI Coach Says...</h2>
              
              {/* Category Tabs */}
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {Object.keys(gameCategories).map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`${
                        activeCategory === category
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                      {category}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Active Recommendation */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            )}
            {error && (
              <div className="text-red-600 bg-red-100 p-4 rounded-md">
                <p>Error: {error}</p>
              </div>
            )}
            {recommendation && !isLoading && (
              <div className="prose max-w-none prose-indigo mb-8">
                <h3 className="text-lg font-medium mb-2">Focus: {recommendation.focusArea} | Advice: {recommendation.adviceType}</h3>
                <div className="whitespace-pre-wrap text-gray-800">
                  {recommendation.recommendations}
                </div>
              </div>
            )}

            {/* Category Recommendations */}
            <div className="space-y-6">
              {groupedRecommendations[activeCategory]?.map((rec) => (
                <div key={rec.id} className="border-b pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-medium">{rec.focusArea} - {rec.adviceType}</h3>
                    <span className="text-sm text-gray-500">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="prose max-w-none prose-sm text-gray-600">
                    {rec.recommendations}
                  </div>
                </div>
              ))}
              {(!groupedRecommendations[activeCategory] || groupedRecommendations[activeCategory].length === 0) && (
                <p className="text-gray-500">No recommendations yet for this category.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 