import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

interface Profile {
  profilePicUrl?: string;          // kept for future use
  missDescription?: string;
  preShotRoutine?: string;
  favoriteThoughts?: string;
  homeCourse?: string;
  handicap?: number | '';
}

export default function ProfileCard() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  /* fetch profile on mount */
  useEffect(() => {
    (async () => {
      const r = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) setProfile(await r.json());
    })();
  }, [token]);

  if (!profile) return null;

  return (
    <div className="bg-white shadow rounded-lg p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <button
          onClick={() => navigate('/profile')}
          className="text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Handicap</h3>
          <p className="text-lg">{profile.handicap || 'Not set'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Home Course</h3>
          <p className="text-lg">{profile.homeCourse || 'Not set'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Miss Description</h3>
          <p className="text-lg whitespace-pre-wrap">{profile.missDescription || 'Not set'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Pre-Shot Routine</h3>
          <p className="text-lg whitespace-pre-wrap">{profile.preShotRoutine || 'Not set'}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Favorite Thoughts</h3>
          <p className="text-lg whitespace-pre-wrap">{profile.favoriteThoughts || 'Not set'}</p>
        </div>
      </div>
    </div>
  );
}
