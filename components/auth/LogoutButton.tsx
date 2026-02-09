'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/firebase/auth';

interface LogoutButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'button' | 'link';
  onClick?: () => void;
}

/**
 * Client-only logout button. Signs out via Firebase and redirects to /login.
 */
const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = '',
  children = 'Log out',
  variant = 'button',
  onClick,
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    onClick?.();
    setLoading(true);
    try {
      await logoutUser();
      router.replace('/login');
    } catch (err) {
      console.error('Logout error:', err);
      setLoading(false);
    }
  };

  if (variant === 'link') {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={`text-gray-700 hover:text-ibfashionhub-red transition-colors duration-300 disabled:opacity-50 ${className}`}
      >
        {loading ? 'Signing out...' : children}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className={`inline-flex items-center justify-center font-medium rounded-md border border-transparent px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-700 text-white hover:bg-gray-800 focus:ring-gray-500 ${className}`}
    >
      {loading ? 'Signing out...' : children}
    </button>
  );
};

export default LogoutButton;
