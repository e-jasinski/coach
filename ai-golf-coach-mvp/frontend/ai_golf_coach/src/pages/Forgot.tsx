import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Input from '../components/input';

export default function Forgot() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) return setMsg(data.message || 'Request failed');
      setIsSubmitted(true);
    } catch {
      setMsg('Network error. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Reset Password
        </h2>

        {!isSubmitted ? (
          <>
            <p className="text-center text-sm text-gray-600">
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <Input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white
                       hover:bg-indigo-700 focus:outline-none"
            >
              Send Reset Link
            </button>

            {msg && <p className="text-center text-sm text-red-600">{msg}</p>}
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-600 mb-4">
              If an account exists with that email, you will receive a password reset link.
            </p>
            <Link
              to="/login"
              className="text-indigo-600 hover:underline"
            >
              Return to Login
            </Link>
          </div>
        )}

        <p className="text-center text-sm">
          Remember your password?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}