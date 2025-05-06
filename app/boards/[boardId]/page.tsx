import { getColumnsFromBoard } from '@/actions/columns';
import { getBoard } from '@/actions/boards';
import { notFound } from 'next/navigation';
import { PageProps } from '@/types';

import { AddNewColumn } from './components/add-new-column';
import { Board } from './components/board';

export default async function BoardPage({
  params,
}: PageProps<{ boardId: string }>) {
  const { boardId } = await params;

  const [board, columns] = await Promise.all([
    getBoard(boardId),
    getColumnsFromBoard(boardId),
  ]);

  if (!board) {
    notFound();
  }

  return (
    <div className="flex h-full flex-col p-6">
      <Board initial={{ columns }} />

      <div className="flex h-full gap-3 overflow-x-auto pb-8">
        <AddNewColumn boardId={boardId} totalColumn={columns.length} />
      </div>
    </div>
  );
}
