import { ListWithPayload } from '@/types';

export const reorder = (list: ListWithPayload, startIndex: number, endIndex: number): ListWithPayload => {
  const cards = Array.from(list.cards);
  const [removed] = cards.splice(startIndex, 1);
  cards.splice(endIndex, 0, removed);

  return {
    ...list,
    cards,
  };
};

/**
 * Moves an item from one list to another list.
 */
export const move = (
  source: ListWithPayload,
  destination: ListWithPayload,
  droppableSource: { index: number },
  droppableDestination: { index: number }
): { [key: string]: ListWithPayload } => {
  const sourceCards = Array.from(source.cards);
  const destCards = Array.from(destination.cards);
  const [removed] = sourceCards.splice(droppableSource.index, 1);

  destCards.splice(droppableDestination.index, 0, removed);

  const result = {
    [source.id]: { ...source, cards: sourceCards },
    [destination.id]: { ...destination, cards: destCards },
  } as { [key: string]: ListWithPayload };

  return result;
};
