'use client';

import { Card } from '@prisma/client';
import { CardContent } from '@/components/ui/card';

type CardItemProps = {
  card: Card;
};

export function CardItem({ card }: CardItemProps) {
  return (
    <CardContent className="cursor-pointer rounded-md p-2 shadow-sm">
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
