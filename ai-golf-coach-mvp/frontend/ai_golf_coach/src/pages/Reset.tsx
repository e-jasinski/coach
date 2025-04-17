import { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Input from '../components/input';

export default function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setMsg('Invalid reset link. Please request a new one.');
    }
  }, [token]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setMsg('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setMsg('Password must be at least 6 characters');
    }

    try {
      const res = await fetch(`/api/auth/reset/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        return setMsg(data.message || 'Reset failed');
      }
      
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setMsg('Network error. Please try again.');
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-lg text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Invalid Reset Link</h2>
          <p className="text-red-600">{msg}</p>
          <Link to="/forgot" className="text-indigo-600 hover:underline">
            Request a new reset link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Reset Password
        </h2>

        {isSuccess ? (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              Your password has been reset successfully!
            </p>
            <p className="text-sm text-gray-600">
              Redirecting to login page...
            </p>
          </div>
        ) : (
          <>
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white
                       hover:bg-indigo-700 focus:outline-none"
            >
              Reset Password
            </button>

            {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
          </>
        )}
      </form>
    </div>
  );
}
