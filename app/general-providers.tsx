'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Provider as JotaiProvider } from 'jotai';
import { configs } from '@/lib/swr-configs';
import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';

// We will re-organize it later
import { SettingsContextProvider } from '@/components/common/settings-context';

export const GeneralProviders = ({ children }: { children: ReactNode }) => {
  return (
    <NuqsAdapter>
      <SWRConfig value={configs}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <JotaiProvider>
            <SettingsContextProvider>
              {/* position: absolute needed for max-height:100% to be respected internally */}
              <div className="relative flex-grow">
                <div className="absolute inset-0">
                  <main className="h-full bg-sky-700">{children}</main>
                </div>
              </div>
            </SettingsContextProvider>
          </JotaiProvider>
        </NextThemesProvider>
      </SWRConfig>
    </NuqsAdapter>
  );
};
