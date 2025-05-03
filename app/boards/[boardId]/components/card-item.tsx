'use client';

import { CardContent } from '@/components/ui/card';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types';

type CardItemProps = {
  id: string;
  columnId: string;
  index: number;
  card: Card;
};

export function CardItem({ id, columnId, index, card }: CardItemProps) {
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, _snapshot) => (
        <CardContent
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-accent cursor-pointer rounded-md p-2 shadow-sm hover:bg-accent/80"
        >
          <div className="flex flex-col gap-2">
            <div className="text-sm">{card.title}</div>

            {card.description && (
              <div className="text-muted-foreground text-xs">
                {card.description}
              </div>
            )}

            {/* Add more card details like labels, due date, assignees etc */}
          </div>
        </CardContent>
      )}
    </Draggable>
  );
}
