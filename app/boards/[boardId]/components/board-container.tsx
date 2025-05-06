'use client';

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
import { AddNewCard } from './add-new-card';
import { move, reorder } from './helpers';

type BoardContainerProps = {
  lists: ListWithPayload[];
  boardId: string;
  title: string;
};

export const BoardContainer = ({
  lists: listsInput,
  boardId,
  title,
}: BoardContainerProps) => {
  const router = useRouter();

  const [lists, setLists] = useState(listsInput);

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

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sourceList = lists.find((list) => list.id === source.droppableId);

    const destinationList = lists.find(
      (list) => list.id === destination.droppableId
    );

    if (!sourceList || !destinationList) {
      return;
    }

    // Save the original state for rollback in case of error
    const originalState = [...lists];

    try {
      if (source.droppableId === destination.droppableId) {
        // Same list reordering
        const updatedList = reorder(
          sourceList,
          source.index,
          destination.index
        );
        const newState = lists.map((list) =>
          list.id === source.droppableId ? updatedList : list
        );
        setLists(newState);

        // Update card order in database
        const movedCard = sourceList.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
        });
      } else {
        // Moving between lists
        const result = move(sourceList, destinationList, source, destination);
        const newState = lists.map((list) => result[list.id] || list);
        setLists(newState);

        // Update card order and list in database
        const movedCard = sourceList.cards[source.index];
        await reorderCard({
          id: movedCard.id,
          order: destination.index,
          listId: destinationList.id,
        });
      }
    } catch {
      // Rollback to original state if the server update fails
      setLists(originalState);
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
        {lists.map((l) => (
          <ListContainer key={l.id} id={l.id} list={l}>
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
              listId={l.id}
              totalCard={l.cards.length}
            />
          </ListContainer>
        ))}
      </div>

      <AlertModal
        isOpen={deleteModalOpen}
        onCloseAction={() => setDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
        loading={deleting}
        title="Delete Board"
        description="Are you sure you want to delete this board? This will also delete all lists and cards within this board and cannot be undone."
      />
    </>
  );
};
