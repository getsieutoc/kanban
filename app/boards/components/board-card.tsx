import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Board } from '@/types';

function getColorForBoard(board: Board): string {
  const colorsMap: Record<string, string> = {
    DEVELOPMENT: 'bg-slate-400',
    INNOVATION: 'bg-cyan-600',
    MARKETING: 'bg-amber-600',
    GROWING: 'bg-purple-600',
  };

  return colorsMap[board.title] || 'bg-gray-600';
}

type BoardCardProps = {
  board: Board;
};

export const BoardCard = ({ board }: BoardCardProps) => {
  return (
    <Card
      key={board.id}
      className={cn(
        'flex h-32 cursor-pointer flex-col justify-between p-4 hover:opacity-90',
        getColorForBoard(board)
      )}
    >
      <div>
        <h3 className="font-semibold text-white uppercase">{board.title}</h3>
        {board.description && (
          <p className="mt-1 text-sm text-white/80">{board.description}</p>
        )}
      </div>
      <div className="self-end">
        <div className="rounded-full bg-white/20 p-1">
          <div className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
};
