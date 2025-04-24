'use client';

import { Card } from '@/components/ui/card';
import { List } from '@prisma/client';

type ListContainerProps = {
  list: List;
  children?: React.ReactNode;
};

export function ListContainer({ list, children }: ListContainerProps) {
  return (
    <Card className="h-full w-[272px] shrink-0 p-2">
      <div className="mb-2 px-2">
        <h3 className="text-sm font-medium">{list.title}</h3>
      </div>

      <div className="flex flex-col gap-2">{children}</div>
    </Card>
  );
}
