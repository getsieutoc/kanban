import { getBoard } from '@/actions/boards';
import { getListsFromBoard } from '@/actions/lists';
import { PageProps } from '@/types';
import { ListContainer } from './components/list-container';
import { CardItem } from './components/card-item';
import { AddCardButton } from './components/add-card-button';
import { AddNewList } from './components/add-list-button';
import { BoardHeader } from './components/board-header';
import { notFound } from 'next/navigation';

export default async function BoardPage({
  params,
}: PageProps<{ boardId: string }>) {
  const { boardId } = await params;

  const [board, lists] = await Promise.all([
    getBoard(boardId),
    getListsFromBoard(boardId),
  ]);

  if (!board) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col">
      <BoardHeader board={board} />

      <div className="flex h-full gap-3 overflow-x-auto p-6 pb-8">
        {lists.map((list) => (
          <ListContainer key={list.id} list={list}>
            {list.cards.map((card) => (
              <CardItem key={card.id} card={card} />
            ))}

            <AddCardButton
              listId={list.id}
              // onClick={() => {
              //   // We'll implement this later
              //   console.log('Add card to list:', list.id);
              // }}
            />
          </ListContainer>
        ))}

        <AddNewList boardId={boardId} />
      </div>
    </div>
  );
}
