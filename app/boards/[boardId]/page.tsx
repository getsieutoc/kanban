import { getBoard } from '@/actions/boards';
import { getListsFromBoard } from '@/actions/lists';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types';

import { AddNewList } from './components/add-new-list';
import { BoardHeader } from './components/board-header';
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
    <div className="flex h-full flex-col">
      <BoardHeader board={board} />

      <div className="flex h-full gap-3 overflow-x-auto p-6 pb-8">
        <BoardContainer lists={lists} />

        <AddNewList boardId={boardId} totalList={lists.length} />
      </div>
    </div>
  );
}
