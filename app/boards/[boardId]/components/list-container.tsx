'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { List } from '@/types';

type ListContainerProps = {
  id: string;
  list: List;
  children?: React.ReactNode;
};

export function ListContainer({ id, list, children }: ListContainerProps) {
  return (
    <Droppable droppableId={`${id}`}>
      {(provided, _snapshot) => (
        <Card
          ref={provided.innerRef}
          className="h-full w-64 shrink-0 p-2"
          // style={getListStyle(snapshot.isDraggingOver)}
          {...provided.droppableProps}
        >
          <div className="mb-2 px-2">
            <h3 className="text-sm font-medium">{list.title}</h3>
          </div>

          <div className={`flex min-h-[50px] flex-col gap-2 ${'abc'}`}>
            {children}
          </div>
        </Card>
      )}
    </Droppable>
  );
}
