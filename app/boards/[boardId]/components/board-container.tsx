'use client';

import { ListWithPayload } from '@/types';
import { DragDropProvider } from '@dnd-kit/react';
import { useState } from 'react';
import { ListContainer } from './list-container';
import { CardItem } from './card-item';

type BoardContainerProps = {
  lists: ListWithPayload[];
};

export const BoardContainer = ({ lists }: BoardContainerProps) => {
  console.log('---------------------- re-render');
  const [items, setItems] = useState(lists);

  const handleDragEnd = (event: any) => {
    if (!event.operation?.over) return;

    const activeId = event.operation.draggable.id;
    const overId = event.operation.over.id;

    // Find the source and target lists
    const activeList = items.find(
      (list) =>
        list.cards.some((card) => card.id === activeId) || list.id === activeId
    );
    const overList = items.find((list) => list.id === overId);

    if (!activeList || !overList) return;

    // Update the lists state
    setItems((currentItems) => {
      const newItems = [...currentItems];

      // If dragging a card
      if (activeList.cards.some((card) => card.id === activeId)) {
        const card = activeList.cards.find((c) => c.id === activeId)!;

        // Remove card from source list
        const sourceListIndex = newItems.findIndex(
          (l) => l.id === activeList.id
        );
        newItems[sourceListIndex].cards = newItems[
          sourceListIndex
        ].cards.filter((c) => c.id !== activeId);

        // Add card to target list
        const targetListIndex = newItems.findIndex((l) => l.id === overList.id);
        newItems[targetListIndex].cards.push({
          ...card,
          listId: overList.id,
        });
      }

      return newItems;
    });
  };

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        console.log('### event: ', event);
        const { source } = event.operation;
        console.log('### source type: ', source?.type);

        // const activeId = event.operation.draggable.id;
        // const overId = event.operation.over.id;
      }}
    >
      {items.map((l) => (
        <ListContainer key={l.id} id={l.id} list={l}>
          {l.cards.map((c) => (
            <CardItem key={c.id} id={c.id} columnId={l.id} card={c} />
          ))}
        </ListContainer>
      ))}
    </DragDropProvider>
  );
};
