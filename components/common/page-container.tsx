import { ScrollArea } from '@/components/ui/scroll-area';
import { type ReactNode } from 'react';

export type PageContainerProps = {
  children: ReactNode;
  scrollable?: boolean;
};
export const PageContainer = ({
  children,
  scrollable = true,
}: PageContainerProps) => {
  return scrollable ? (
    <ScrollArea className="h-[calc(100dvh-64px)]">
      <div className="h-full p-4 md:px-4">{children}</div>
    </ScrollArea>
  ) : (
    <div className="h-full p-4 md:px-4">{children}</div>
  );
};
