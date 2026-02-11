'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthProviderButtons from './AuthProviderButtons';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Phase 1: No actual auth, just demo navigation
    localStorage.setItem('teacher_email', email);
    router.push('/dashboard');
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Edu AI Agent</h1>
      <p className="text-gray-600 mb-6">Teacher Lesson Planner</p>
      
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

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Demo mode – any credentials work
      </p>
    </div>
  );
}
