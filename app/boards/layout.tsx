import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SIDEBAR_COOKIE_NAME } from '@/lib/constants';
import { KBar } from '@/components/common/kbar';
import { type LayoutProps } from '@/types';
import { cookies } from 'next/headers';
import { type Metadata } from 'next';

import { DashboardSidebar } from './components/sidebar';
import { Header } from './components/header';

export const metadata: Metadata = {
  title: 'Dashboard | Kanban',
};

export default async function DashboardLayout({ children }: LayoutProps) {
  const cookieStore = await cookies();

  const currentState = cookieStore.get(SIDEBAR_COOKIE_NAME)?.value === 'true';

  return (
    <KBar>
      <SidebarProvider defaultOpen={currentState}>
        <DashboardSidebar />
        <SidebarInset>
          <Header />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </KBar>
  );
}
