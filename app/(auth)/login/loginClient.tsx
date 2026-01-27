'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { loginUser } from '@/firebase/auth';
import Button from '@/components/ui/Button';

const LoginClient: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get('redirect') || '/profile/orders';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await loginUser(email, password);

      if (redirect.startsWith('/') && !redirect.includes('..')) {
        router.replace(redirect);
      } else {
        router.replace('/profile/orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
  };

  return (
    <MainLayout title="Login - IBFashionHub" description="Sign in to your account">
      <div className="min-h-screen flex items-center justify-center py-12">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <Button
              type="submit"
              variant="orange"
              fullWidth
            >
              Sign in
            </Button>
          </form>

          <p className="text-center text-sm">
            Don’t have an account?{' '}
            <a href="/signup" className="text-indigo-600 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginClient;
