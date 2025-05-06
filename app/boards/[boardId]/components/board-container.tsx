'use client';

import { reorderCard } from '@/actions/cards';
import { ColumnWithPayload } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { AlertModal } from '@/components/common/alert-modal';
import { deleteBoard } from '@/actions/boards';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ColumnContainer } from './column-container';
import { CardItem } from './card-item';
import { AddNewCard } from './add-new-card';
import { move, reorder } from './helpers';

type BoardContainerProps = {
  columns: ColumnWithPayload[];
  boardId: string;
  title: string;
};

export const BoardContainer = ({
  columns: columnsInput,
  boardId,
  title,
}: BoardContainerProps) => {
  const router = useRouter();

  const [columns, setColumns] = useState(columnsInput);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBoard(boardId);
      router.push('/boards');
    } catch {
      console.error('Problem while deleting board');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const onDragEnd = async (event: {
    source: { droppableId: string; index: number };
    destination: { droppableId: string; index: number } | null;
  }) => {
    const { source, destination } = event;

    // dropped outside the column
    if (!destination) {
      return;
    }

    const sourceColumn = columns.find(
      (column) => column.id === source.droppableId
    );

    const destinationColumn = columns.find(
      (column) => column.id === destination.droppableId
    );

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    // Save the original state for rollback in case of error
    const originalState = [...columns];

    try {
      if (source.droppableId === destination.droppableId) {
        // Same column reordering
        const updatedColumn = reorder(
          sourceColumn,
          source.index,
          destination.index
        );
        const newState = columns.map((column) =>
          column.id === source.droppableId ? updatedColumn : column
        );
        setColumns(newState);

        // Update card order in database
        const movedCard = sourceColumn.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
        });
      } else {
        // Moving between columns
        const result = move(
          sourceColumn,
          destinationColumn,
          source,
          destination
        );
        const newState = columns.map((column) => result[column.id] || column);
        setColumns(newState);

        // Update card order and column in database
        const movedCard = sourceColumn.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
          columnId: destinationColumn.id,
        });
      }
    } catch {
      // Rollback to original state if the server update fails
      setColumns(originalState);
      console.error('Failed to update card order');
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
              Delete Board
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-4">
        {columns.map((l) => (
          <ColumnContainer key={l.id} id={l.id} column={l}>
            {l.cards.map((c, j) => (
              <CardItem
                key={c.id}
                id={c.id}
                index={j}
                columnId={l.id}
                boardId={boardId}
                card={c}
              />
            ))}
            <AddNewCard
              boardId={boardId}
              columnId={l.id}
              totalCard={l.cards.length}
            />
          </ColumnContainer>
        ))}
      </div>

      <AlertModal
        isOpen={deleteModalOpen}
        onCloseAction={() => setDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
        loading={deleting}
        title="Delete Board"
        description="Are you sure you want to delete this board? This will also delete all columns and cards within this board and cannot be undone."
      />
    </>
  );
};
