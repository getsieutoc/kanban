'use client';

import { Card } from '@/components/ui/card';
import { List } from '@prisma/client';
import { useDroppable } from '@dnd-kit/react';

type ListContainerProps = {
  id: string;
  list: List;
  children?: React.ReactNode;
};

export function ListContainer({ id, list, children }: ListContainerProps) {
  const { ref, isDropTarget, droppable } = useDroppable({
    id,
    data: {
      type: 'list',
    },
  });

  return (
    <Card className="h-full w-64 shrink-0 p-2">
      <div className="mb-2 px-2">
        <h3 className="text-sm font-medium">{list.title}</h3>
      </div>

      <div 
        ref={ref}
        {...droppable}
        className={`flex flex-col gap-2 min-h-[50px] ${
          isDropTarget ? 'bg-muted/50' : ''
        }`}
      >
        {children}
      </div>
    </Card>
  );
}
