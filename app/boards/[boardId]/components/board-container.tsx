'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { reorderCard } from '@/actions/cards';
import { ListWithPayload } from '@/types';
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

import { ListContainer } from './list-container';
import { CardItem } from './card-item';
import { move, reorder } from './helpers';

type BoardContainerProps = {
  lists: ListWithPayload[];
  boardId: string;
  title: string;
};

export const BoardContainer = ({ lists, boardId, title }: BoardContainerProps) => {
  const router = useRouter();
  const [state, setState] = useState(lists);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteBoard(boardId);
      router.push('/boards');
    } catch (error) {
      console.error(error);
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

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sourceList = state.find((list) => list.id === source.droppableId);
    const destinationList = state.find((list) => list.id === destination.droppableId);

    if (!sourceList || !destinationList) {
      return;
    }

    // Save the original state for rollback in case of error
    const originalState = [...state];

    try {
      if (source.droppableId === destination.droppableId) {
        // Same list reordering
        const updatedList = reorder(sourceList, source.index, destination.index);
        const newState = state.map((list) =>
          list.id === source.droppableId ? updatedList : list
        );
        setState(newState);

        // Update card order in database
        const movedCard = sourceList.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
        });
      } else {
        // Moving between lists
        const result = move(sourceList, destinationList, source, destination);
        const newState = state.map((list) => result[list.id] || list);
        setState(newState);

        // Update card order and list in database
        const movedCard = sourceList.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
          listId: destinationList.id,
        });
      }
    } catch (error) {
      // Rollback to original state if the server update fails
      setState(originalState);
      console.error('Failed to update card order:', error);
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

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {state.map((l) => (
            <ListContainer key={l.id} id={l.id} list={l}>
              {l.cards.map((c, j) => (
                <CardItem key={c.id} id={c.id} index={j} columnId={l.id} card={c} />
              ))}
            </ListContainer>
          ))}
        </div>
      </DragDropContext>

      <AlertModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Board"
        description="Are you sure you want to delete this board? This will also delete all lists and cards within this board and cannot be undone."
      />
    </>
  );
};
