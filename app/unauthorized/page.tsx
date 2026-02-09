'use client';

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';

export default function UnauthorizedPage() {
  return (
    <MainLayout title="Unauthorized - IBFashionHub" description="You do not have access to this page">
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access denied</h1>
        <p className="text-gray-600 mb-6">You are not authorized to view this page.</p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Log in
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
