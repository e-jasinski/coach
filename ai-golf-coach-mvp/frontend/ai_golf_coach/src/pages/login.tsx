import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import Input from '../components/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPwd] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();
  const { login } = useAuth();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) return setMsg(data.message || 'Login failed');
    login(data.token);
    nav('/');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Sign in
        </h2>

        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPwd(e.target.value)}
        />

        <div className="flex justify-end">
          <Link to="/forgot" className="text-sm text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white
                     hover:bg-indigo-700 focus:outline-none"
        >
          Login
        </button>

        {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

        <p className="text-center text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
