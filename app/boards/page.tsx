'use client';

import { BoardList } from './components/board-list';
import { useAuth } from '@/hooks/use-auth';
import { Spinner } from '@/components/common/spinner';

export default function BoardsPage() {
  const { userData, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const activeMembership = userData?.memberships?.[0];
  const activeTenant = activeMembership?.tenant;

  if (!activeTenant) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No active workspace found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <BoardList
        workspace={activeTenant}
        boards={activeTenant.boards || []}
        remainingBoardsCount={0}
      />
    </div>
  );
}
