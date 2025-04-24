'use client';

import { Card } from '@prisma/client';
import { CardContent } from '@/components/ui/card';
import { useDraggable } from '@dnd-kit/react';

type CardItemProps = {
  id: string;
  columnId: string;
  index?: number;
  card: Card;
};

export function CardItem({
  id,
  columnId,
  index,
  card,
}: CardItemProps) {
  const { ref, isDragging } = useDraggable({
    id,
    data: {
      type: 'card',
      columnId,
      index,
    },
  });

  return (
    <CardContent 
      ref={ref} 
      className={`cursor-pointer rounded-md p-2 shadow-sm ${
        isDragging ? 'opacity-50' : ''
      }`}
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
  );
}
