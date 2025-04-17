import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/input';

interface RegForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export default function Register() {
  const [form, setForm] = useState<RegForm>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.message || 'Error');
    nav('/login');
  };

  const onChange = (k: keyof RegForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-lg"
      >
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          Create account
        </h2>

        <Input placeholder="Email" value={form.email} onChange={onChange('email')} />
        <Input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange('password')}
        />
        <Input
          placeholder="First name"
          value={form.firstName}
          onChange={onChange('firstName')}
        />
        <Input
          placeholder="Last name"
          value={form.lastName}
          onChange={onChange('lastName')}
        />

        <button
          className="w-full rounded-md bg-indigo-600 py-2 font-medium text-white
                     hover:bg-indigo-700"
        >
          Register
        </button>

        {msg && <p className="text-center text-sm text-red-600">{msg}</p>}

        <p className="text-center text-sm">
          Have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
