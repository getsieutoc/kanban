'use client';

import { ListWithPayload } from '@/types';
import { DragDropProvider } from '@dnd-kit/react';
import { move } from '@dnd-kit/helpers';
import { useState } from 'react';
import { ListContainer } from './list-container';
import { CardItem } from './card-item';

type BoardContainerProps = {
  lists: ListWithPayload[];
};

export const BoardContainer = ({ lists }: BoardContainerProps) => {
  const [items, setItems] = useState(lists);

  return (
    <DragDropProvider
      onDragOver={(event) => {
        console.log('### event: ', event);
        setItems((items) => move(items, event));
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
