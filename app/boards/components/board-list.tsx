'use client';

import { useState } from 'react';
import { Board } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { BoardCard } from './board-card';
import { AddNewBoard } from './board-editor';
import { Card } from '@/components/ui/card';
import { Plus } from '@/components/icons';

type BoardListProps = {
  boards: Board[];
  remainingBoardsCount?: number;
};

export function BoardList({ boards }: BoardListProps) {
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
      <div className="bg-border h-px" />

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
          <AddNewBoard
            trigger={
              <Card className="flex h-32 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-gray-300 bg-gray-800/30 p-4 hover:bg-gray-700/30">
                <div className="text-center">
                  <Plus />
                  <p className="font-medium">Add new board</p>
                </div>
              </Card>
            }
          />

          {/* Existing boards */}
          {sortedBoards.map((board) => (
            <BoardCard board={board} key={board.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
