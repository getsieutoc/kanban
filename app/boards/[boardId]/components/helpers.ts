import { ColumnWithPayload } from '@/types';

export const reorder = (
  column: ColumnWithPayload,
  startIndex: number,
  endIndex: number
): ColumnWithPayload => {
  const cards = Array.from(column.cards);
  const [removed] = cards.splice(startIndex, 1);
  cards.splice(endIndex, 0, removed);

  return {
    ...column,
    cards,
  };
};

/**
 * Moves an item from one column to another column.
 */
export const move = (
  source: ColumnWithPayload,
  destination: ColumnWithPayload,
  droppableSource: { index: number },
  droppableDestination: { index: number }
): { [key: string]: ColumnWithPayload } => {
  const sourceCards = Array.from(source.cards);
  const destCards = Array.from(destination.cards);
  const [removed] = sourceCards.splice(droppableSource.index, 1);

  destCards.splice(droppableDestination.index, 0, removed);

  const result = {
    [source.id]: { ...source, cards: sourceCards },
    [destination.id]: { ...destination, cards: destCards },
  } as { [key: string]: ColumnWithPayload };

  return result;
};
