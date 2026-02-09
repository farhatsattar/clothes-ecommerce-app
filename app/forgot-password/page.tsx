'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { sendPasswordReset } from '@/firebase/auth';
import Button from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setStatus('loading');

    if (!email.trim()) {
      setStatus('error');
      setMessage('Please enter your email address.');
      return;
    }

    try {
      await sendPasswordReset(email.trim());
      setStatus('success');
      setMessage('Check your inbox. We sent a password reset link to ' + email.trim());
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to send reset email.');
    }
  };

  return (
    <MainLayout title="Forgot Password - IBFashionHub" description="Reset your password">
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            Forgot password
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Enter your email and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {status === 'success' && (
              <div className="rounded-md bg-green-50 p-4 text-sm text-green-800" role="alert">
                {message}
              </div>
            )}
            {status === 'error' && (
              <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" role="alert">
                {message}
              </div>
            )}

            <label htmlFor="forgot-email" className="sr-only">
              Email address
            </label>
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-ibfashionhub-red focus:border-transparent"
              disabled={status === 'loading'}
            />

            <Button
              type="submit"
              variant="orange"
              fullWidth
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            <Link href="/login" className="font-medium text-ibfashionhub-red hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
