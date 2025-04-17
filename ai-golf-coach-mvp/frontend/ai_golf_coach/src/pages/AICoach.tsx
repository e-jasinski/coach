import { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';

interface Recommendations {
  recommendations: string;
  context: {
    profile: {
      missDescription?: string;
      preShotRoutine?: string;
      favoriteThoughts?: string;
      handicap?: number;
    };
    latestSession: {
      content: string;
      date: string;
    } | null;
  };
}

export default function AICoach() {
  const { token, logout } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchRecommendations = async (refresh = false) => {
    setLoading(true);
    setError('');
    try {
      const url = new URL('/api/ai-coach/recommendations', window.location.origin);
      if (refresh) {
        url.searchParams.append('refresh', 'true');
      }
      
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data = await res.json();
      setRecommendations(data);
    } catch (err) {
      setError('Failed to get recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Golf Coach</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
            <Link to="/ai-coach" className="text-gray-600 hover:text-gray-900">AI Coach</Link>
          </nav>
        </div>
        <button
          onClick={() => logout()}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Context Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Miss Description</h3>
                <p className="text-lg whitespace-pre-wrap">
                  {recommendations?.context.profile.missDescription || 'Not set'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Pre-Shot Routine</h3>
                <p className="text-lg whitespace-pre-wrap">
                  {recommendations?.context.profile.preShotRoutine || 'Not set'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Favorite Thoughts</h3>
                <p className="text-lg whitespace-pre-wrap">
                  {recommendations?.context.profile.favoriteThoughts || 'Not set'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Handicap</h3>
                <p className="text-lg">
                  {recommendations?.context.profile.handicap || 'Not set'}
                </p>
              </div>
            </div>
          </div>

          {/* Latest Session Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Latest Session</h2>
            {recommendations?.context.latestSession ? (
              <div>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(recommendations.context.latestSession.date).toLocaleDateString()}
                </p>
                <p className="text-lg whitespace-pre-wrap">
                  {recommendations.context.latestSession.content}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No recent sessions recorded</p>
            )}
          </div>

          {/* Recommendations Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">AI Coach Recommendations</h2>
              <button
                onClick={() => fetchRecommendations(true)}
                disabled={loading}
                className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Get New Recommendations'}
              </button>
            </div>

            {error ? (
              <p className="text-red-600">{error}</p>
            ) : loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-lg">
                  {recommendations?.recommendations || 'No recommendations available'}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 