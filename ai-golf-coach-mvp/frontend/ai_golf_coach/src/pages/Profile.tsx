import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import Input from '../components/input';
import TextArea from '../components/TextArea';

interface Profile {
  profilePicUrl?: string;
  missDescription?: string;
  preShotRoutine?: string;
  favoriteThoughts?: string;
  homeCourse?: string;
  handicap?: number | '';
}

export default function Profile() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<Profile>({});
  const [msg, setMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    })();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profile),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message || 'Error updating profile');
    setIsEditing(false);
    setMsg('');
  };

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
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Handicap</label>
                  <Input
                    type="number"
                    value={profile.handicap || ''}
                    onChange={(e) => setProfile({ ...profile, handicap: e.target.value ? Number(e.target.value) : '' })}
                    placeholder="Enter your handicap"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Home Course</label>
                  <Input
                    value={profile.homeCourse || ''}
                    onChange={(e) => setProfile({ ...profile, homeCourse: e.target.value })}
                    placeholder="Enter your home course"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Miss Description</label>
                <TextArea
                  value={profile.missDescription || ''}
                  onChange={(e) => setProfile({ ...profile, missDescription: e.target.value })}
                  placeholder="Describe your typical misses"
                  className="w-full h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pre-Shot Routine</label>
                <TextArea
                  value={profile.preShotRoutine || ''}
                  onChange={(e) => setProfile({ ...profile, preShotRoutine: e.target.value })}
                  placeholder="Describe your pre-shot routine"
                  className="w-full h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Favorite Thoughts</label>
                <TextArea
                  value={profile.favoriteThoughts || ''}
                  onChange={(e) => setProfile({ ...profile, favoriteThoughts: e.target.value })}
                  placeholder="Enter your favorite swing thoughts"
                  className="w-full h-32"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Handicap</h3>
                <p className="text-lg">{profile.handicap || 'Not set'}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Home Course</h3>
                <p className="text-lg">{profile.homeCourse || 'Not set'}</p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Miss Description</h3>
                <p className="text-lg whitespace-pre-wrap">{profile.missDescription || 'Not set'}</p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Pre-Shot Routine</h3>
                <p className="text-lg whitespace-pre-wrap">{profile.preShotRoutine || 'Not set'}</p>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Favorite Thoughts</h3>
                <p className="text-lg whitespace-pre-wrap">{profile.favoriteThoughts || 'Not set'}</p>
              </div>
            </div>
          )}

          {msg && <p className="mt-4 text-sm text-red-600">{msg}</p>}
        </div>
      </main>
    </div>
  );
} 