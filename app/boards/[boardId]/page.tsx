import { getBoard } from '@/actions/boards';
import { getListsFromBoard } from '@/actions/lists';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types';

import { AddNewList } from './components/add-new-list';
import { BoardContainer } from './components/board-container';

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
    <div className="flex h-full flex-col p-6">
      <BoardContainer 
        lists={lists} 
        boardId={boardId} 
        title={board.title} 
      />

      <div className="flex h-full gap-3 overflow-x-auto pb-8">
        <AddNewList boardId={boardId} totalList={lists.length} />
      </div>
    </div>
  );
}
