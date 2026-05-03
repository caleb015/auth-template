'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { appConfig } from '@/config/app';
import AuthProviderButtons from './AuthProviderButtons';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async ({ preventDefault }: { preventDefault(): void }) => {
    preventDefault();
    setError('');
    setSuccessMsg('');
    setIsLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';

    try {
      const res = await fetch(`${appConfig.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = Array.isArray(data.message) ? data.message[0] : data.message;
        setError(msg || 'Something went wrong');
        return;
      }

      if (isRegister) {
        setSuccessMsg('Account created! You can now sign in.');
        setIsRegister(false);
        setPassword('');
        return;
      }

      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);
      document.cookie = 'logged_in=true; path=/; SameSite=Lax';
      router.push('/dashboard');
    } catch {
      setError('Unable to reach the server. Make sure the API is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{appConfig.name}</h1>
      <p className="text-gray-600 mb-6">{appConfig.subtitle}</p>
      <AuthProviderButtons className="mb-4" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={toggleMode}
          className="text-indigo-600 hover:underline font-medium"
        >
          {isRegister ? 'Sign In' : 'Register'}
        </button>
      </p>
    </div>
  );
}
