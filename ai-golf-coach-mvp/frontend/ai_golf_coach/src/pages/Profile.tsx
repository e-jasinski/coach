import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useAuth } from '../AuthContext';
import { Link } from 'react-router-dom';
import Input from '../components/input';
import TextArea from '../components/TextArea';
import CheckboxGroup from '../components/CheckboxGroup';
import RatingSelect from '../components/RatingSelect';
import { Profile, driverMissOptions, ironMissOptions, shortGameMissOptions, puttingMissOptions, mentalOptions } from '../types/profile';

// Initial empty state matching the Profile structure
const initialProfileState: Profile = {
  profilePicUrl: null,
  homeCourse: null,
  handicap: null,
  playingFrequency: null,
  yearsPlaying: null,
  goals: null,
  driverMisses: [],
  driverMissDescription: null,
  driverStrengthRating: null,
  ironMisses: [],
  ironMissDescription: null,
  ironStrengthRating: null,
  swingFocus: null,
  shortGameMisses: [],
  shortGameDescription: null,
  chippingRating: null,
  pitchingRating: null,
  bunkerRating: null,
  puttingMisses: [],
  puttingDescription: null,
  shortPuttRating: null,
  mediumPuttRating: null,
  lagPuttRating: null,
  greenReadingRating: null,
  mentalStrengths: [],
  mentalWeaknesses: [],
  mentalGameNotes: null,
  preShotRoutine: null,
  favoriteThoughts: null,
  driverInfo: null,
  ironInfo: null,
  wedgeInfo: null,
  putterInfo: null,
};

export default function ProfilePage() {
  const { token, logout } = useAuth();
  const [profile, setProfile] = useState<Profile>(initialProfileState);
  const [msg, setMsg] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject('Failed to fetch'))
      .then(data => {
        // Ensure array fields are initialized properly if null/undefined from backend
        const sanitizedData: Profile = {
          ...initialProfileState,
          ...data,
          driverMisses: data.driverMisses || [],
          ironMisses: data.ironMisses || [],
          shortGameMisses: data.shortGameMisses || [],
          puttingMisses: data.puttingMisses || [],
          mentalStrengths: data.mentalStrengths || [],
          mentalWeaknesses: data.mentalWeaknesses || [],
        };
        setProfile(sanitizedData);
      })
      .catch(() => setMsg('Error loading profile'))
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const processedValue = type === 'number' ? (value === '' ? null : Number(value)) : value;
    setProfile(prev => ({ ...prev, [name]: processedValue }));
  };

  const handleCheckboxChange = (field: keyof Profile, value: string) => {
    setProfile(prev => {
      const currentValues = prev[field] as string[] || [];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error updating profile');
      setProfile(data);
      setIsEditing(false);
      setMsg('Profile updated successfully!');
      setTimeout(() => setMsg(''), 3000);
    } catch (error: any) {
      setMsg(error.message);
    }
  };

  const renderDisplayText = (label: string, value: string | number | string[] | null | undefined, preformatted = false) => {
    let displayValue: string;
    if (Array.isArray(value)) {
      displayValue = value.length > 0 ? value.join(', ') : 'Not set';
    } else {
      displayValue = value ? String(value) : 'Not set';
    }

    return (
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <p className={`text-lg ${preformatted ? 'whitespace-pre-wrap' : ''}`}>{displayValue}</p>
      </div>
    );
  };

  const renderRating = (label: string, value: number | null | undefined) => {
    const displayValue = value ? `${value}/5` : 'Not rated';
    return (
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
        <p className="text-lg">{displayValue}</p>
      </div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">AI Golf Coach</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link to="/profile" className="font-semibold text-indigo-600">Profile</Link>
            <Link to="/ai-coach" className="text-gray-600 hover:text-gray-900">AI Coach</Link>
          </nav>
        </div>
        <button onClick={logout} className="text-sm text-gray-600 hover:text-gray-900">Logout</button>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">Profile Information</h2>
            <button
              onClick={() => { setIsEditing(!isEditing); setMsg(''); }}
              className="rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Core Info Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Handicap" name="handicap" type="number" step="0.1" value={profile.handicap ?? ''} onChange={handleInputChange} placeholder="e.g., 15.2" />
                  <Input label="Home Course" name="homeCourse" value={profile.homeCourse ?? ''} onChange={handleInputChange} />
                  <Input label="Playing Frequency" name="playingFrequency" value={profile.playingFrequency ?? ''} onChange={handleInputChange} placeholder="e.g., Once a week" />
                  <Input label="Years Playing" name="yearsPlaying" type="number" value={profile.yearsPlaying ?? ''} onChange={handleInputChange} />
                  <TextArea label="Your Goals" name="goals" value={profile.goals ?? ''} onChange={handleInputChange} placeholder="e.g., Break 90, Fix slice, Enjoy the game more" />
                </div>
              </section>

              {/* Full Swing Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Full Swing (Driver & Irons)</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Driver</h4>
                    <CheckboxGroup label="Typical Driver Misses" field="driverMisses" options={driverMissOptions} selected={profile.driverMisses || []} onChange={handleCheckboxChange} />
                    <TextArea label="Driver Miss Description" name="driverMissDescription" value={profile.driverMissDescription ?? ''} onChange={handleInputChange} placeholder="Any specific details?" />
                    <RatingSelect label="Driver Confidence/Performance" name="driverStrengthRating" value={profile.driverStrengthRating ?? ''} onChange={handleInputChange} />
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Irons</h4>
                    <CheckboxGroup label="Typical Iron Misses" field="ironMisses" options={ironMissOptions} selected={profile.ironMisses || []} onChange={handleCheckboxChange} />
                    <TextArea label="Iron Miss Description" name="ironMissDescription" value={profile.ironMissDescription ?? ''} onChange={handleInputChange} placeholder="Any specific details?" />
                    <RatingSelect label="Iron Confidence/Performance" name="ironStrengthRating" value={profile.ironStrengthRating ?? ''} onChange={handleInputChange} />
                  </div>
                  <TextArea label="Current Swing Focus" name="swingFocus" value={profile.swingFocus ?? ''} onChange={handleInputChange} placeholder="e.g., Tempo, takeaway, shallowing the club" />
                </div>
              </section>

              {/* Short Game Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Short Game</h3>
                <div className="space-y-6">
                  <CheckboxGroup label="Typical Short Game Misses (<100 yards)" field="shortGameMisses" options={shortGameMissOptions} selected={profile.shortGameMisses || []} onChange={handleCheckboxChange} />
                  <TextArea label="Short Game Notes" name="shortGameDescription" value={profile.shortGameDescription ?? ''} onChange={handleInputChange} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <RatingSelect label="Chipping (<30 yds)" name="chippingRating" value={profile.chippingRating ?? ''} onChange={handleInputChange} />
                    <RatingSelect label="Pitching (30-100 yds)" name="pitchingRating" value={profile.pitchingRating ?? ''} onChange={handleInputChange} />
                    <RatingSelect label="Bunker Play" name="bunkerRating" value={profile.bunkerRating ?? ''} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              {/* Putting Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Putting</h3>
                <div className="space-y-6">
                  <CheckboxGroup label="Typical Putting Issues" field="puttingMisses" options={puttingMissOptions} selected={profile.puttingMisses || []} onChange={handleCheckboxChange} />
                  <TextArea label="Putting Notes" name="puttingDescription" value={profile.puttingDescription ?? ''} onChange={handleInputChange} />
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <RatingSelect label="Short Putts (<6ft)" name="shortPuttRating" value={profile.shortPuttRating ?? ''} onChange={handleInputChange} />
                    <RatingSelect label="Medium Putts (6-20ft)" name="mediumPuttRating" value={profile.mediumPuttRating ?? ''} onChange={handleInputChange} />
                    <RatingSelect label="Lag Putting (>20ft)" name="lagPuttRating" value={profile.lagPuttRating ?? ''} onChange={handleInputChange} />
                    <RatingSelect label="Green Reading" name="greenReadingRating" value={profile.greenReadingRating ?? ''} onChange={handleInputChange} />
                  </div>
                </div>
              </section>

              {/* Mental Game Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Mental Game</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CheckboxGroup label="Mental Strengths" field="mentalStrengths" options={mentalOptions} selected={profile.mentalStrengths || []} onChange={handleCheckboxChange} />
                  <CheckboxGroup label="Mental Weaknesses" field="mentalWeaknesses" options={mentalOptions} selected={profile.mentalWeaknesses || []} onChange={handleCheckboxChange} />
                </div>
                <TextArea label="Mental Game Notes" name="mentalGameNotes" value={profile.mentalGameNotes ?? ''} onChange={handleInputChange} className="mt-6"/>
                <TextArea label="Pre-Shot Routine" name="preShotRoutine" value={profile.preShotRoutine ?? ''} onChange={handleInputChange} className="mt-6"/>
                <TextArea label="Favorite Swing Thoughts" name="favoriteThoughts" value={profile.favoriteThoughts ?? ''} onChange={handleInputChange} className="mt-6"/>
              </section>

              {/* Equipment Section */}
              <section className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Equipment (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input label="Driver" name="driverInfo" value={profile.driverInfo ?? ''} onChange={handleInputChange} placeholder="e.g., Titleist TSR2 10.5" />
                  <Input label="Irons" name="ironInfo" value={profile.ironInfo ?? ''} onChange={handleInputChange} placeholder="e.g., Mizuno JPX 923 4-PW"/>
                  <Input label="Wedges" name="wedgeInfo" value={profile.wedgeInfo ?? ''} onChange={handleInputChange} placeholder="e.g., Vokey SM9 50, 54, 58"/>
                  <Input label="Putter" name="putterInfo" value={profile.putterInfo ?? ''} onChange={handleInputChange} placeholder="e.g., Scotty Cameron Newport 2"/>
                </div>
              </section>

              <div className="flex justify-end mt-8">
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-8 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Core Info Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Handicap', profile.handicap)}
                  {renderDisplayText('Home Course', profile.homeCourse)}
                  {renderDisplayText('Playing Frequency', profile.playingFrequency)}
                  {renderDisplayText('Years Playing', profile.yearsPlaying)}
                  {renderDisplayText('Your Goals', profile.goals, true)}
                </div>
              </section>

              {/* Full Swing Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Full Swing</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Typical Driver Misses', profile.driverMisses)}
                  {renderDisplayText('Driver Miss Notes', profile.driverMissDescription, true)}
                  {renderRating('Driver Performance Rating', profile.driverStrengthRating)}
                  {renderDisplayText('Typical Iron Misses', profile.ironMisses)}
                  {renderDisplayText('Iron Miss Notes', profile.ironMissDescription, true)}
                  {renderRating('Iron Performance Rating', profile.ironStrengthRating)}
                </div>
                {renderDisplayText('Current Swing Focus', profile.swingFocus, true)}
              </section>

              {/* Short Game Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Short Game</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Typical Short Game Misses', profile.shortGameMisses)}
                  {renderDisplayText('Short Game Notes', profile.shortGameDescription, true)}
                  {renderRating('Chipping (<30 yds)', profile.chippingRating)}
                  {renderRating('Pitching (30-100 yds)', profile.pitchingRating)}
                  {renderRating('Bunker Play', profile.bunkerRating)}
                </div>
              </section>

              {/* Putting Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Putting</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Typical Putting Issues', profile.puttingMisses)}
                  {renderDisplayText('Putting Notes', profile.puttingDescription, true)}
                  {renderRating('Short Putts (<6ft)', profile.shortPuttRating)}
                  {renderRating('Medium Putts (6-20ft)', profile.mediumPuttRating)}
                  {renderRating('Lag Putting (>20ft)', profile.lagPuttRating)}
                  {renderRating('Green Reading', profile.greenReadingRating)}
                </div>
              </section>

              {/* Mental Game Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Mental Game</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Mental Strengths', profile.mentalStrengths)}
                  {renderDisplayText('Mental Weaknesses', profile.mentalWeaknesses)}
                </div>
                {renderDisplayText('Mental Game Notes', profile.mentalGameNotes, true)}
                {renderDisplayText('Pre-Shot Routine', profile.preShotRoutine, true)}
                {renderDisplayText('Favorite Swing Thoughts', profile.favoriteThoughts, true)}
              </section>

              {/* Equipment Display */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b pb-2">Equipment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderDisplayText('Driver', profile.driverInfo)}
                  {renderDisplayText('Irons', profile.ironInfo)}
                  {renderDisplayText('Wedges', profile.wedgeInfo)}
                  {renderDisplayText('Putter', profile.putterInfo)}
                </div>
              </section>
            </div>
          )}

          {msg && <p className={`mt-6 text-sm ${msg.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>{msg}</p>}
        </div>
      </main>
    </div>
  );
} 