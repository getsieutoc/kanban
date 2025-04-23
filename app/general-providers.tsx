'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as JotaiProvider } from 'jotai';
import { configs } from '@/lib/swr-configs';
import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';

export const GeneralProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NuqsAdapter>
      <SWRConfig value={configs}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <JotaiProvider>{children}</JotaiProvider>
        </NextThemesProvider>
      </SWRConfig>
    </NuqsAdapter>
  );
};
