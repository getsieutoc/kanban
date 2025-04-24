'use client';

import { Plus } from '@/components/icons';
import { Button } from '@/components/ui/button';

type AddCardButtonProps = {
  listId: string;
};

export function AddCardButton({ listId }: AddCardButtonProps) {
  return (
    <Button
      variant="ghost"
      className="text-muted-foreground flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-sm"
    >
      <Plus className="h-4 w-4" />
      <span>Add a card</span>
    </Button>
  );
}
