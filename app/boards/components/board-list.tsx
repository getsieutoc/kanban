'use client';

import { useState } from 'react';
import { Board } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface BoardListProps {
  workspace: {
    id: string;
    name: string;
    icon?: string;
    url?: string;
    isPrivate?: boolean;
  };
  boards: Board[];
  remainingBoardsCount?: number;
}

export function BoardList({
  workspace,
  boards,
  remainingBoardsCount = 0,
}: BoardListProps) {
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Most recently active');
  const [filterBy, setFilterBy] = useState('');

  // Filter boards based on search query
  const filteredBoards = boards.filter(
    (board) =>
      board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (board.description?.toLowerCase() || '').includes(
        searchQuery.toLowerCase()
      )
  );

  // Sort boards based on selected option
  const sortedBoards = [...filteredBoards].sort((a, b) => {
    switch (sortBy) {
      case 'Title A-Z':
        return a.title.localeCompare(b.title);
      case 'Date created':
        return b.createdAt.getTime() - a.createdAt.getTime();
      case 'Most recently active':
      default:
        return b.updatedAt.getTime() - a.updatedAt.getTime();
    }
  });

  return (
    <div className="flex flex-col space-y-6">
      {/* Workspace header */}
      <div className="flex items-center justify-between">
        <Button
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Invite Workspace members
        </Button>
      </div>

      {/* Divider */}
      <div className="bg-border h-px" />

      {/* Boards section */}
      <div>
        <h3 className="mb-4 text-xl font-semibold">Boards</h3>

        {/* Control row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Sort dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Sort by</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {sortBy} <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => setSortBy('Most recently active')}
                  >
                    Most recently active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('Title A-Z')}>
                    Title A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('Date created')}>
                    Date created
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Filter dropdown */}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-xs">Filter by</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {filterBy || 'Choose a collection'}{' '}
                    <span className="ml-2">▼</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterBy('All')}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('Recent')}>
                    Recent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('Favorites')}>
                    Favorites
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search */}
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground text-xs">Search</span>
            <div className="relative">
              <Input
                className="w-64 pr-8"
                placeholder="Search boards"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Escape' ||
                    (e.key === 'Backspace' && searchQuery === '')
                  ) {
                    setSearchQuery('');
                  }
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Boards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Create new board card */}
          <Card className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-gray-300 bg-gray-800/30 p-4 hover:bg-gray-700/30">
            <div className="text-center">
              <p className="font-medium">Create new board</p>
              <p className="text-muted-foreground text-sm">
                {remainingBoardsCount} remaining
              </p>
            </div>
          </Card>

          {/* Existing boards */}
          {sortedBoards.map((board) => (
            <Card
              key={board.id}
              className={cn(
                'flex h-32 cursor-pointer flex-col justify-between p-4 hover:opacity-90',
                getColorForBoard(board)
              )}
            >
              <div>
                <h3 className="font-semibold text-white uppercase">
                  {board.title}
                </h3>
                {board.description && (
                  <p className="mt-1 text-sm text-white/80">
                    {board.description}
                  </p>
                )}
              </div>
              <div className="self-end">
                <div className="rounded-full bg-white/20 p-1">
                  <div className="h-4 w-4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function getColorForBoard(board: Board): string {
  const colorsMap: Record<string, string> = {
    DEVELOPMENT: 'bg-slate-400',
    INNOVATION: 'bg-cyan-600',
    MARKETING: 'bg-amber-600',
    GROWING: 'bg-purple-600',
  };

  return colorsMap[board.title] || 'bg-gray-600';
}
