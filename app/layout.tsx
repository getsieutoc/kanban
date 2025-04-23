
import { Toaster } from '@/components/ui/sonner';
import { Roboto } from 'next/font/google';
import type { Metadata } from 'next';

import { GeneralProviders } from './general-providers';
import './globals.css';

const roboto = Roboto({
  variable: '--font-content-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'Your Melody, Our Mission',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} font-body scroll-smooth antialiased`}
      >
        <GeneralProviders>{children}</GeneralProviders>
        <Toaster />
      </body>
    </html>
  );
}
