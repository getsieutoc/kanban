'use client';

import {
  getColumnData,
  isCardData,
  isCardDropTargetData,
  isColumnData,
  isDraggingACard,
  isDraggingAColumn,
  TCardData,
} from '@/lib/data';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { unsafeOverflowAutoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/unsafe-overflow/element';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { DragLocationHistory } from '@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { blockBoardPanningAttr, type ColumnWithPayload } from '@/types';
import { SettingsContext } from '@/components/common/settings-context';
import { memo, useContext, useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { isShallowEqual } from '@/lib/is-shallow-equal';
import { Ellipsis } from '@/components/icons';
import { clientQueue } from '@/lib/client-queue';
import { isSafari } from '@/lib/is-safari';
import { clearCache } from '@/lib/cache';
import invariant from 'tiny-invariant';

import { CardItem, CardShadow } from './card';
import { AddNewCard } from './add-new-card';

type ColumnState =
  | {
      type: 'is-card-over';
      isOverChildCard: boolean;
      dragging: DOMRect;
    }
  | {
      type: 'is-column-over';
    }
  | {
      type: 'idle';
    }
  | {
      type: 'is-dragging';
    };

const stateStyles: { [Key in ColumnState['type']]: string } = {
  idle: 'cursor-grab',
  'is-card-over': 'outline outline-2 outline-neutral-50',
  'is-dragging': 'opacity-40',
  'is-column-over': 'bg-slate-900',
};

const idle = { type: 'idle' } satisfies ColumnState;

/**
 * A memoized component for rendering out the card.
 *
 * Created so that state changes to the column don't require all cards to be rendered
 */
const CardColumn = memo(function CardColumn({
  column,
}: {
  column: ColumnWithPayload;
}) {
  return column.cards.map((card) => (
    <CardItem key={card.id} card={card} column={column} />
  ));
});

export function Column({ column }: { column: ColumnWithPayload }) {
  const scrollableRef = useRef<HTMLDivElement | null>(null);

  const outerFullHeightRef = useRef<HTMLDivElement | null>(null);

  const headerRef = useRef<HTMLDivElement | null>(null);

  const innerRef = useRef<HTMLDivElement | null>(null);

  const { settings } = useContext(SettingsContext);

  const [state, setState] = useState<ColumnState>(idle);

  useEffect(() => {
    const outer = outerFullHeightRef.current;
    const scrollable = scrollableRef.current;
    const header = headerRef.current;
    const inner = innerRef.current;
    invariant(outer);
    invariant(scrollable);
    invariant(header);
    invariant(inner);

    const data = getColumnData({ column });

    function setIsCardOver({
      data,
      location,
    }: {
      data: TCardData;
      location: DragLocationHistory;
    }) {
      const innerMost = location.current.dropTargets[0];
      const isOverChildCard = Boolean(
        innerMost && isCardDropTargetData(innerMost.data)
      );

      const proposed: ColumnState = {
        type: 'is-card-over',
        dragging: data.rect,
        isOverChildCard,
      };
      // optimization - don't update state if we don't need to.
      setState((current) => {
        if (isShallowEqual(proposed, current)) {
          return current;
        }
        return proposed;
      });
    }

    return combine(
      draggable({
        element: header,
        getInitialData: () => data,
        onGenerateDragPreview({ source, location, nativeSetDragImage }) {
          const data = source.data;
          invariant(isColumnData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: header,
              input: location.current.input,
            }),
            render({ container }) {
              // Simple drag preview generation: just cloning the current element.
              // Not using react for this.
              const rect = inner.getBoundingClientRect();
              const preview = inner.cloneNode(true);
              invariant(preview instanceof HTMLElement);
              preview.style.width = `${rect.width}px`;
              preview.style.height = `${rect.height}px`;

              // rotation of native drag previews does not work in safari
              if (!isSafari()) {
                preview.style.transform = 'rotate(4deg)';
              }

              container.appendChild(preview);
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop({ source }) {
          // if (isCardData(source.data) && source.data.columnId !== column.id) {
          //   // When dropping directly on a column, add to the end
          //   const lastCardOrder =
          //     column.cards.length > 0
          //       ? column.cards[column.cards.length - 1].order
          //       : 0;
          //
          //   const newOrder = lastCardOrder + 1;
          //
          //   // Queue the database update
          //   clientQueue.addCardUpdate({
          //     cardId: source.data.card.id,
          //     columnId: column.id,
          //     order: newOrder,
          //     boardId: column.boardId
          //   });
          // }
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getData: () => data,
        canDrop({ source }) {
          return isDraggingACard({ source }) || isDraggingAColumn({ source });
        },
        getIsSticky: () => true,
        onDragStart({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
          }
        },
        onDragEnter({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
          if (
            isColumnData(source.data) &&
            source.data.column.id !== column.id
          ) {
            setState({ type: 'is-column-over' });
          }
        },
        onDropTargetChange({ source, location }) {
          if (isCardData(source.data)) {
            setIsCardOver({ data: source.data, location });
            return;
          }
        },
        onDragLeave({ source }) {
          if (
            isColumnData(source.data) &&
            source.data.column.id === column.id
          ) {
            return;
          }
          setState(idle);
        },
        onDrop({ source }) {
          // if (isCardData(source.data) && source.data.columnId !== column.id) {
          //   // When dropping directly on a column, add to the end
          //   const lastCardOrder =
          //     column.cards.length > 0
          //       ? column.cards[column.cards.length - 1].order
          //       : 0;

          //   reorderCard({
          //     id: source.data.card.id,
          //     columnId: column.id,
          //     order: lastCardOrder + 1,
          //   }).then(() => {
          //     clearCache(`/boards/${column.boardId}`);
          //   });
          // }
          setState(idle);
        },
      }),
      autoScrollForElements({
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        element: scrollable,
      }),
      unsafeOverflowAutoScrollForElements({
        element: scrollable,
        getConfiguration: () => ({
          maxScrollSpeed: settings.columnScrollSpeed,
        }),
        canScroll({ source }) {
          if (!settings.isOverElementAutoScrollEnabled) {
            return false;
          }

          if (!settings.isOverflowScrollingEnabled) {
            return false;
          }

          return isDraggingACard({ source });
        },
        getOverflow() {
          return {
            forTopEdge: {
              top: 1000,
            },
            forBottomEdge: {
              bottom: 1000,
            },
          };
        },
      })
    );
  }, [column, settings]);

  return (
    <div
      className="flex w-72 flex-shrink-0 flex-col select-none"
      ref={outerFullHeightRef}
    >
      <div
        className={`flex max-h-full flex-col rounded-lg bg-slate-800 text-neutral-50 ${stateStyles[state.type]}`}
        ref={innerRef}
        {...{ [blockBoardPanningAttr]: true }}
      >
        {/* Extra wrapping element to make it easy to toggle visibility of content when a column is dragging over */}
        <div
          className={`flex max-h-full flex-col ${state.type === 'is-column-over' ? 'invisible' : ''}`}
        >
          <div
            className="flex flex-row items-center justify-between p-3 pb-2"
            ref={headerRef}
          >
            <div className="pl-2 leading-4 font-bold">{column.title}</div>
            <button
              type="button"
              className="rounded p-2 hover:bg-slate-700 active:bg-slate-600"
              aria-label="More actions"
            >
              <Ellipsis size={16} />
            </button>
          </div>
          <div
            className="flex flex-col overflow-y-auto [overflow-anchor:none] [scrollbar-color:theme(colors.slate.600)_theme(colors.slate.700)] [scrollbar-width:thin]"
            ref={scrollableRef}
          >
            <CardColumn column={column} />
            {state.type === 'is-card-over' && !state.isOverChildCard ? (
              <div className="flex-shrink-0 px-3 py-1">
                <CardShadow dragging={state.dragging} />
              </div>
            ) : null}
          </div>
          <div className="flex flex-row gap-2 p-3">
            <AddNewCard boardId={column.boardId} columnId={column.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
