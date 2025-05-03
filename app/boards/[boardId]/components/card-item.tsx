'use client';

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Draggable } from '@hello-pangea/dnd';
import { Card } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertModal } from '@/components/common/alert-modal';
import { deleteCard } from '@/actions/cards';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type CardItemProps = {
  id: string;
  columnId: string;
  index: number;
  card: Card;
};

export function CardItem({ id, columnId, index, card }: CardItemProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCard(id);
      // Card will be removed from UI through revalidation
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <Draggable draggableId={id} index={index}>
        {(provided, _snapshot) => (
          <CardContent
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="bg-accent cursor-pointer rounded-md p-2 shadow-sm hover:bg-accent/80"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex flex-col gap-2 flex-grow">
                <div className="text-sm">{card.title}</div>
                {card.description && (
                  <div className="text-muted-foreground text-xs">
                    {card.description}
                  </div>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                    Delete Card
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        )}
      </Draggable>

      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Card"
        description="Are you sure you want to delete this card? This action cannot be undone."
      />
    </>
  );
}
