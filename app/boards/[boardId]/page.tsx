import { getBoard } from '@/actions/boards';
import { getListsFromBoard } from '@/actions/lists';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types';

import { AddNewList } from './components/add-new-list';
import { Board } from '@/components/common/board';
import { TBoard, TCard, TColumn } from '@/lib/data';
import { BoardContainer } from './components/board-container';

export default async function BoardPage({
  params,
}: PageProps<{ boardId: string }>) {
  const { boardId } = await params;

  const [board, lists] = await Promise.all([
    getBoard(boardId),
    getListsFromBoard(boardId),
  ]);

  // console.log('board', board);
  console.log('lists', lists);

  function getInitialData(): TBoard {
    return {
      columns: lists,
    };
  }

  if (!board) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col p-6">
      {/* <BoardContainer lists={lists} boardId={boardId} title={board.title} /> */}

      <Board initial={getInitialData()} />

      <div className="flex h-full gap-3 overflow-x-auto pb-8">
        <AddNewList boardId={boardId} totalList={lists.length} />
      </div>
    </div>
  );
}
