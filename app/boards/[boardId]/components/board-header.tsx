'use client';

import { Board } from '@prisma/client';

type BoardHeaderProps = {
  board: Board;
};

export function BoardHeader({ board }: BoardHeaderProps) {
  return (
    <div className="border-border flex items-center justify-between border-b px-6 py-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">{board.title}</h1>

        {board.description && (
          <p className="text-muted-foreground text-sm">{board.description}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-muted-foreground text-sm">
          {board.visibility.toLowerCase()}
        </span>
      </div>
    </div>
  );
}
