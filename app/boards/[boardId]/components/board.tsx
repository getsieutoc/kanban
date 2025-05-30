'use client';

import {
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
} from '@/lib/data';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { reorderWithEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/reorder-with-edge';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { CleanupFn } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { blockBoardPanningAttr, type ColumnWithPayload } from '@/types';
import { SettingsContext } from '@/components/common/settings-context';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { useContext, useEffect, useRef, useState } from 'react';
import { clientQueue } from '@/lib/client-queue';
import { bindAll } from 'bind-event-listener';
import invariant from 'tiny-invariant';

import { Column } from './column';

type BoardProps = {
  initial: {
    columns: ColumnWithPayload[];
  };
};

export const Board = ({ initial }: BoardProps) => {
  // const [data, setData] = useControllableState({
  //   prop: initial,
  //   defaultProp: { columns: [] },
  // });

  const [data, setData] = useState(initial);

  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const { settings } = useContext(SettingsContext);

  useEffect(() => {
    const element = scrollableRef.current;
    invariant(element);

    return combine(
      monitorForElements({
        canMonitor: isDraggingACard,
        onDrop({ source, location }) {
          const dragging = source.data;

          if (!isCardData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];

          if (!innerMost) {
            return;
          }

          const dropTargetData = innerMost.data;
          const homeColumnIndex = data.columns.findIndex(
            (column) => column.id === dragging.columnId
          );
          const home: ColumnWithPayload | undefined =
            data.columns[homeColumnIndex];

          if (!home) {
            return;
          }
          const cardIndexInHome = home.cards.findIndex(
            (card) => card.id === dragging.card.id
          );

          // dropping on a card
          if (isCardDropTargetData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.columnId
            );
            const destination = data.columns[destinationColumnIndex];
            // reordering in home column
            if (home === destination) {
              const cardFinishIndex = home.cards.findIndex(
                (card) => card.id === dropTargetData.card.id
              );

              // could not find cards needed
              if (cardIndexInHome === -1 || cardFinishIndex === -1) {
                return;
              }

              // no change needed
              if (cardIndexInHome === cardFinishIndex) {
                return;
              }

              const closestEdge = extractClosestEdge(dropTargetData);

              const reordered = reorderWithEdge({
                axis: 'vertical',
                list: home.cards,
                startIndex: cardIndexInHome,
                indexOfTarget: cardFinishIndex,
                closestEdgeOfTarget: closestEdge,
              });

              const updated: ColumnWithPayload = {
                ...home,
                cards: reordered,
              };
              const columns = Array.from(data.columns);
              columns[homeColumnIndex] = updated;

              setData({ ...data, columns });

              reordered.forEach((card, index) => {
                if (card.order !== index) {
                  clientQueue.addCardUpdate({
                    columnId: card.columnId,
                    cardId: card.id,
                    order: index,
                  });
                }
              });

              return;
            }

            // moving card from one column to another
            console.info('moving card from one column to another');

            // unable to find destination
            if (!destination) {
              return;
            }

            const targetIndex = destination.cards.findIndex(
              (card) => card.id === dropTargetData.card.id
            );

            const closestEdge = extractClosestEdge(dropTargetData);
            const finalIndex =
              closestEdge === 'bottom' ? targetIndex + 1 : targetIndex;

            // remove card from home column
            const homeCards = Array.from(home.cards);
            homeCards.splice(cardIndexInHome, 1);

            // insert into destination column
            const destinationCards = Array.from(destination.cards);
            destinationCards.splice(finalIndex, 0, dragging.card);

            const columns = Array.from(data.columns);
            columns[homeColumnIndex] = {
              ...home,
              cards: homeCards,
            };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };

            setData({ ...data, columns });

            homeCards.forEach((card, index) => {
              if (card.order !== index) {
                clientQueue.addCardUpdate({
                  columnId: columns[homeColumnIndex].id,
                  cardId: card.id,
                  order: index,
                });
              }
            });

            destinationCards.forEach((card, index) => {
              if (card.order !== index) {
                clientQueue.addCardUpdate({
                  columnId: columns[destinationColumnIndex].id,
                  cardId: card.id,
                  order: index,
                });
              }
            });

            return;
          }

          // dropping onto a column, but not onto a card
          if (isColumnData(dropTargetData)) {
            const destinationColumnIndex = data.columns.findIndex(
              (column) => column.id === dropTargetData.column.id
            );
            const destination = data.columns[destinationColumnIndex];

            if (!destination) {
              return;
            }

            // dropping on home
            if (home === destination) {
              console.info('moving card to home column');

              // move to last position
              const reordered = reorder({
                list: home.cards,
                startIndex: cardIndexInHome,
                finishIndex: home.cards.length - 1,
              });

              const updated: ColumnWithPayload = {
                ...home,
                cards: reordered,
              };

              const columns = Array.from(data.columns);
              columns[homeColumnIndex] = updated;

              setData({ ...data, columns });

              reordered.forEach((card, index) => {
                if (card.order !== index) {
                  clientQueue.addCardUpdate({
                    columnId: columns[homeColumnIndex].id,
                    cardId: card.id,
                    order: index,
                  });
                }
              });

              return;
            }

            console.info('moving card to another column');

            // remove card from home column

            const homeCards = Array.from(home.cards);
            homeCards.splice(cardIndexInHome, 1);

            // insert into destination column
            const destinationCards = Array.from(destination.cards);
            destinationCards.splice(destination.cards.length, 0, dragging.card);

            const columns = Array.from(data.columns);
            columns[homeColumnIndex] = {
              ...home,
              cards: homeCards,
            };
            columns[destinationColumnIndex] = {
              ...destination,
              cards: destinationCards,
            };

            setData({ ...data, columns });

            homeCards.forEach((card, index) => {
              if (card.order !== index) {
                clientQueue.addCardUpdate({
                  columnId: columns[homeColumnIndex].id,
                  cardId: card.id,
                  order: index,
                });
              }
            });

            destinationCards.forEach((card, index) => {
              if (card.order !== index) {
                clientQueue.addCardUpdate({
                  columnId: columns[destinationColumnIndex].id,
                  cardId: card.id,
                  order: index,
                });
              }
            });

            return;
          }
        },
      }),
      monitorForElements({
        canMonitor: isDraggingAColumn,
        onDrop({ source, location }) {
          const dragging = source.data;
          if (!isColumnData(dragging)) {
            return;
          }

          const innerMost = location.current.dropTargets[0];

          if (!innerMost) {
            return;
          }
          const dropTargetData = innerMost.data;

          if (!isColumnData(dropTargetData)) {
            return;
          }

          const homeIndex = data.columns.findIndex(
            (column) => column.id === dragging.column.id
          );
          const destinationIndex = data.columns.findIndex(
            (column) => column.id === dropTargetData.column.id
          );

          if (homeIndex === -1 || destinationIndex === -1) {
            return;
          }

          if (homeIndex === destinationIndex) {
            return;
          }

          const reordered = reorder({
            list: data.columns,
            startIndex: homeIndex,
            finishIndex: destinationIndex,
          });
          // Update UI state
          setData({ ...data, columns: reordered });

          // Queue updates for all affected columns
          reordered.forEach((column, index) => {
            if (column.order !== index) {
              clientQueue.addColumnUpdate({
                boardId: column.boardId,
                columnId: column.id,
                order: index,
              });
            }
          });
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
        element,
      }),
      unsafeOverflowAutoScrollForElements({
        element,
        getConfiguration: () => ({ maxScrollSpeed: settings.boardScrollSpeed }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!settings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getOverflow() {
          return {
            forLeftEdge: {
              top: 1000,
              left: 1000,
              bottom: 1000,
            },
            forRightEdge: {
              top: 1000,
              right: 1000,
              bottom: 1000,
            },
          };
        },
      })
    );
  }, [data, settings]);

  // Panning the board
  useEffect(() => {
    let cleanupActive: CleanupFn | null = null;

    const scrollable = scrollableRef.current;

    invariant(scrollable);

    function begin({ startX }: { startX: number }) {
      let lastX = startX;

      const cleanupEvents = bindAll(
        window,
        [
          {
            type: 'pointermove',
            listener(event) {
              const currentX = event.clientX;
              const diffX = lastX - currentX;

              lastX = currentX;
              scrollable?.scrollBy({ left: diffX });
            },
          },
          // stop panning if we see any of these events
          ...(
            [
              'pointercancel',
              'pointerup',
              'pointerdown',
              'keydown',
              'resize',
              'click',
              'visibilitychange',
            ] as const
          ).map((eventName) => ({
            type: eventName,
            listener: () => cleanupEvents(),
          })),
        ],
        // need to make sure we are not after the "pointerdown" on the scrollable
        // Also this is helpful to make sure we always hear about events from this point
        { capture: true }
      );

      cleanupActive = cleanupEvents;
    }

    const cleanupStart = bindAll(scrollable, [
      {
        type: 'pointerdown',
        listener(event) {
          if (!(event.target instanceof HTMLElement)) {
            return;
          }
          // ignore interactive elements
          if (event.target.closest(`[${blockBoardPanningAttr}]`)) {
            return;
          }

          begin({ startX: event.clientX });
        },
      },
    ]);

    return function cleanupAll() {
      cleanupStart();
      cleanupActive?.();
    };
  }, []);

  return (
    <div
      className={`flex h-full flex-col ${settings.isBoardMoreObvious ? 'px-32 py-20' : ''}`}
    >
      <div
        className={`flex h-full flex-row gap-3 overflow-x-auto p-3 [scrollbar-color:theme(colors.sky.600)_theme(colors.sky.800)] [scrollbar-width:thin] ${settings.isBoardMoreObvious ? 'rounded border-2 border-dashed' : ''}`}
        ref={scrollableRef}
      >
        {data.columns.map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};
