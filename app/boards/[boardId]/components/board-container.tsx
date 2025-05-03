'use client';

import { DragDropContext } from '@hello-pangea/dnd';
import { reorderCard } from '@/actions/cards';
import { ListWithPayload } from '@/types';
import { useState } from 'react';

import { ListContainer } from './list-container';
import { CardItem } from './card-item';
import { move, reorder } from './helpers';

type BoardContainerProps = {
  lists: ListWithPayload[];
};

export const BoardContainer = ({ lists }: BoardContainerProps) => {
  console.log('---------------------- re-render');
  const [state, setState] = useState(lists);

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
    <DragDropContext onDragEnd={onDragEnd}>
      {state.map((l) => (
        <ListContainer key={l.id} id={l.id} list={l}>
          {l.cards.map((c, j) => (
            <CardItem key={c.id} id={c.id} index={j} columnId={l.id} card={c} />
          ))}
        </ListContainer>
      ))}
    </DragDropContext>
  );
};
