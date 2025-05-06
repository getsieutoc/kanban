'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertModal } from '@/components/common/alert-modal';
import { CardContent } from '@/components/ui/card';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/types';

import { deleteCard } from '@/actions/cards';
import { clearCache } from '@/lib/cache';
import { useState } from 'react';

type CardItemProps = {
  id: string;
  columnId: string;
  boardId: string;
  card: Card;
};

export function CardItem({ id, boardId, card }: CardItemProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCard(id);
      await clearCache(`/boards/${boardId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  return (
    <>
      <CardContent className="bg-accent hover:bg-accent/80 cursor-pointer rounded-md p-2 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-grow flex-col gap-2">
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

      <AlertModal
        isOpen={deleteModalOpen}
        onCloseAction={() => setDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
        loading={deleting}
        title="Delete Card"
        description="Are you sure you want to delete this card? This action cannot be undone."
      />
    </>
  );
}
