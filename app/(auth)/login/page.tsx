import { Suspense } from 'react';
import { Metadata } from 'next';

import { LoginForm } from './form';

export const metadata: Metadata = {
  title: 'Login | Kanban',
};

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
