import { Suspense } from 'react';
import LoginClient from './loginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <LoginClient />
    </Suspense>
  );
}

