'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getCardData,
  getCardDropTargetData,
  isCardData,
  isDraggingACard,
} from '@/lib/data';
import {
  type Edge,
  attachClosestEdge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { AlertModal } from '@/components/common/alert-modal';
import { deleteCard, reorderCard } from '@/actions/cards';
import { isShallowEqual } from '@/lib/is-shallow-equal';
import { Column, type CardWithPayload } from '@/types';
import { MoreHorizontal } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { isSafari } from '@/lib/is-safari';
import { clearCache } from '@/lib/cache';
import { createPortal } from 'react-dom';
import invariant from 'tiny-invariant';

type TCardState =
  | {
      type: 'idle';
    }
  | {
      type: 'is-dragging';
    }
  | {
      type: 'is-dragging-and-left-self';
    }
  | {
      type: 'is-over';
      dragging: DOMRect;
      closestEdge: Edge;
    }
  | {
      type: 'preview';
      container: HTMLElement;
      dragging: DOMRect;
    };

const idle: TCardState = { type: 'idle' };

const innerStyles: { [Key in TCardState['type']]?: string } = {
  idle: 'hover:outline-1 outline-0 outline-neutral-50 cursor-grab',
  'is-dragging': 'opacity-40',
};

const outerStyles: { [Key in TCardState['type']]?: string } = {
  // We no longer render the draggable item after we have left it
  // as it's space will be taken up by a shadow on adjacent items.
  // Using `display:none` rather than returning `null` so we can always
  // return refs from this component.
  // Keeping the refs allows us to continue to receive events during the drag.
  'is-dragging-and-left-self': 'hidden',
};

export function CardShadow({ dragging }: { dragging: DOMRect }) {
  return (
    <div
      className="flex-shrink-0 rounded bg-slate-900"
      style={{ height: dragging.height }}
    />
  );
}

const CardDisplay = ({
  boardId,
  card,
  state,
  outerRef,
  innerRef,
}: {
  boardId: string;
  card: CardWithPayload;
  state: TCardState;
  outerRef?: RefObject<HTMLDivElement | null>;
  innerRef?: RefObject<HTMLDivElement | null>;
}) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await deleteCard(card.id);
    } catch (error) {
      console.error(error);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      clearCache(`/boards/${boardId}`);
    }
  };
  return (
    <>
      <div
        ref={outerRef}
        className={`flex flex-shrink-0 flex-col gap-2 px-3 py-1 ${outerStyles[state.type]}`}
      >
        {/* Put a shadow before the item if closer to the top edge */}
        {state.type === 'is-over' && state.closestEdge === 'top' ? (
          <CardShadow dragging={state.dragging} />
        ) : null}
        <div
          ref={innerRef}
          className={`flex items-center justify-between rounded bg-slate-700 p-2 text-slate-300 ${innerStyles[state.type]}`}
          style={
            state.type === 'preview'
              ? {
                  width: state.dragging.width,
                  height: state.dragging.height,
                  transform: !isSafari() ? 'rotate(4deg)' : undefined,
                }
              : undefined
          }
        >
          <div className="text-sm">{card.title}</div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDeleteModalOpen(true)}>
                Delete Card
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Put a shadow after the item if closer to the bottom edge */}
        {state.type === 'is-over' && state.closestEdge === 'bottom' ? (
          <CardShadow dragging={state.dragging} />
        ) : null}
      </div>

      <AlertModal
        isOpen={deleteModalOpen}
        onCloseAction={() => setDeleteModalOpen(false)}
        onConfirmAction={handleDelete}
        loading={deleting}
        title="Delete Card"
        description="Are you sure you want to delete this card? This action cannot be undone."
      />
    </>
  );
};

export const CardItem = ({
  card,
  column,
}: {
  card: CardWithPayload;
  column: Column;
}) => {
  const outerRef = useRef<HTMLDivElement | null>(null);

  const innerRef = useRef<HTMLDivElement | null>(null);

  const [state, setState] = useState<TCardState>(idle);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    invariant(outer && inner);

    return combine(
      draggable({
        element: inner,
        getInitialData: ({ element }) =>
          getCardData({
            card,
            columnId: column.id,
            rect: element.getBoundingClientRect(),
          }),
        onGenerateDragPreview({ nativeSetDragImage, location, source }) {
          const data = source.data;
          invariant(isCardData(data));
          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element: inner,
              input: location.current.input,
            }),
            render({ container }) {
              // Demonstrating using a react portal to generate a preview
              setState({
                type: 'preview',
                container,
                dragging: inner.getBoundingClientRect(),
              });
            },
          });
        },
        onDragStart() {
          setState({ type: 'is-dragging' });
        },
        onDrop() {
          setState(idle);
        },
      }),
      dropTargetForElements({
        element: outer,
        getIsSticky: () => true,
        canDrop: isDraggingACard,
        getData: ({ element, input }) => {
          const data = getCardDropTargetData({ card, columnId: column.id });
          return attachClosestEdge(data, {
            element,
            input,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter({ source, self }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.card.id === card.id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }

          setState({
            type: 'is-over',
            dragging: source.data.rect,
            closestEdge,
          });
        },
        onDrag({ source, self }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.card.id === card.id) {
            return;
          }
          const closestEdge = extractClosestEdge(self.data);
          if (!closestEdge) {
            return;
          }
          // optimization - Don't update react state if we don't need to.
          const proposed: TCardState = {
            type: 'is-over',
            dragging: source.data.rect,
            closestEdge,
          };
          setState((current) => {
            if (isShallowEqual(proposed, current)) {
              return current;
            }
            return proposed;
          });
        },
        onDragLeave({ source }) {
          if (!isCardData(source.data)) {
            return;
          }
          if (source.data.card.id === card.id) {
            setState({ type: 'is-dragging-and-left-self' });
            return;
          }
          setState(idle);
        },
        onDrop({ source, self }) {
          console.log('onDrop', { source, self });

          // if (isCardData(source.data) && source.data.columnId !== column.id) {
          //   const newOrder =
          //     (card.order ?? 0) +
          //     (extractClosestEdge(self.data) === 'bottom' ? 1 : 0);

          //   // Optimistically update the UI through Board's state
          //   const event = new CustomEvent('card-reorder', {
          //     detail: {
          //       cardId: source.data.card.id,
          //       sourceColumnId: source.data.columnId,
          //       targetColumnId: column.id,
          //       newOrder,
          //     },
          //   });
          //   window.dispatchEvent(event);

          //   console.log({ newOrder });

          //   // Update server state
          //   reorderCard({
          //     id: source.data.card.id,
          //     columnId: column.id,
          //     order: newOrder,
          //   }).catch((error) => {
          //     console.error('Failed to reorder card:', error);
          //     // Revert optimistic update on error
          //     clearCache(`/boards/${column.boardId}`);
          //   });
          // }
          setState(idle);
        },
      })
    );
  }, [card, column]);

  return (
    <>
      <CardDisplay
        outerRef={outerRef}
        innerRef={innerRef}
        state={state}
        card={card}
        boardId={column.boardId}
      />
      {state.type === 'preview'
        ? createPortal(
            <CardDisplay state={state} card={card} boardId={column.boardId} />,
            state.container
          )
        : null}
    </>
  );
};
