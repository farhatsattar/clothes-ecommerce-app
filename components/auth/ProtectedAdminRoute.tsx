'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

/**
 * Wraps content that requires an authenticated admin.
 * Redirects to /login if not logged in, to /unauthorized if not admin.
 * Role is read from Firebase ID token custom claims (admin: true).
 */
export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps): React.ReactElement | null {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [adminChecked, setAdminChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loading || !user) {
      if (!loading && !user) router.replace('/login');
      return;
    }

    let cancelled = false;
    user
      .getIdTokenResult()
      .then((token) => {
        if (!cancelled) {
          const admin = token.claims?.admin === true;
          setAdminChecked(true);
          setIsAdmin(admin);
          if (!admin) router.replace('/unauthorized');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAdminChecked(true);
          setIsAdmin(false);
          router.replace('/unauthorized');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!adminChecked || !isAdmin) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-gray-500">{!adminChecked ? 'Checking access...' : 'Redirecting...'}</p>
      </div>
    );
  }

  return <>{children}</>;
}
