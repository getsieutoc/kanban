import { getBoard } from '@/actions/boards';
import { getListsFromBoard } from '@/actions/lists';
import { PageProps } from '@/types';
import { ListContainer } from './components/list-container';
import { CardItem } from './components/card-item';
import { AddNewCard } from './components/add-new-card';
import { AddNewList } from './components/add-new-list';
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

            <AddNewCard
              boardId={boardId}
              listId={list.id}
              totalCard={list.cards.length}
            />
          </ListContainer>
        ))}

        <AddNewList boardId={boardId} totalList={lists.length} />
      </div>
    </div>
  );
}
