'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('user_email');
    if (!stored) {
      router.push('/');
    } else {
      setEmail(stored);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">Welcome, {email}!</p>
          <p className="text-gray-500 mt-2">Dashboard interface coming soon...</p>
        </div>
      </div>
    </div>
  );
}
