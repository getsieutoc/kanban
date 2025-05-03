'use client';

import { DragDropContext } from '@hello-pangea/dnd';
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

  const onDragEnd = (event: any) => {
    const { source, destination } = event;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(state[sInd], source.index, destination.index);
      const newState = [...state];
      newState[sInd] = items;
      setState(newState);
    } else {
      const result = move(state[sInd], state[dInd], source, destination);
      const newState = [...state];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      setState(newState.filter((group) => group.length));
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
