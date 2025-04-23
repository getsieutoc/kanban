import { Suspense } from 'react';
import { Metadata } from 'next';

import { SignupForm } from './form';

export const metadata: Metadata = {
  title: 'Sign Up | Kanban',
};

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}
