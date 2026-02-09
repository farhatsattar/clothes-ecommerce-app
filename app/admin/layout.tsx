'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace('/');
      return;
    }

    let cancelled = false;

    user.getIdTokenResult().then((token) => {
      if (cancelled) return;
      const adminClaim = token.claims.admin === true;
      if (!adminClaim) {
        router.replace('/');
        return;
      }
      setIsAdmin(true);
    }).catch(() => {
      if (!cancelled) router.replace('/');
    });

    return () => { cancelled = true; };
  }, [user, authLoading, router]);

  // Show nothing or spinner while checking auth / redirecting
  if (authLoading || !user || isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ibfashionhub-red" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/admin/products"
                className="text-gray-700 hover:text-ibfashionhub-red px-3 py-2 rounded-md text-sm font-medium"
              >
                Products
              </Link>
              <Link
                href="/admin/orders"
                className="text-gray-700 hover:text-ibfashionhub-red px-3 py-2 rounded-md text-sm font-medium"
              >
                Orders
              </Link>
              <Link
                href="/admin/users"
                className="text-gray-700 hover:text-ibfashionhub-red px-3 py-2 rounded-md text-sm font-medium"
              >
                Users
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;