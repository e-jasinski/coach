import { useEffect, useState, FormEvent } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import Input from '../components/input';
import TextArea from '../components/TextArea';
import ProfileCard from '../components/ProfileCard';

interface Entry {
  id: string;
  content: string;
  course?: string;
  datePlayed?: string;
}

export default function Home() {
  const { token, logout } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [content, setContent] = useState('');
  const [course, setCourse] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
  const [msg, setMsg] = useState('');

  // fetch existing entries
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setEntries(await res.json());
      else if (res.status === 401) logout();
    })();
  }, [token, logout]);

  const addEntry = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/journal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content, course, datePlayed }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message || 'Error');
    setEntries((prev) => [...prev, data.entry]);
    setContent('');
    setCourse('');
    setDatePlayed('');
  };

  const deleteEntry = async (id: string) => {
    const res = await fetch(`/api/journal/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (res.ok) {
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
    } else {
      const data = await res.json();
      setMsg(data.message || 'Error deleting session');
    }
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard />
          </div>

          {/* Session Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Add Session</h2>
              <form onSubmit={addEntry} className="space-y-4">
                <TextArea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you work on today?"
                  className="w-full h-32"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="Course (optional)"
                    className="w-full"
                  />
                  <Input
                    type="date"
                    value={datePlayed}
                    onChange={(e) => setDatePlayed(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    Add Session
                  </button>
                </div>
              </form>
              {msg && <p className="mt-2 text-sm text-red-600">{msg}</p>}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Session History</h2>
              <div className="space-y-6">
                {entries.map((entry) => (
                  <div key={entry.id} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="space-y-1">
                        {entry.course && (
                          <p className="text-sm font-medium text-gray-900">{entry.course}</p>
                        )}
                        {entry.datePlayed && (
                          <p className="text-sm text-gray-500">
                            {new Date(entry.datePlayed).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteEntry(entry.id)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No sessions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}