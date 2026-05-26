'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallback() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      router.push('/');
      return;
    }
    localStorage.setItem('access_token', token);
    document.cookie = 'logged_in=true; path=/; SameSite=Lax';
    router.push('/dashboard');
  }, [router, params]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Signing you in...</p>
    </div>
  );
}
