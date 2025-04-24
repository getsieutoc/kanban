import { getAuth } from '@/auth';
import { BoardList } from './components/board-list';
import { getTenantById } from '@/actions/tenants';

export default async function BoardsPage() {
  const { user } = await getAuth();

  const activeTenant = await getTenantById(user?.activeTenantId);

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
        boards={[]}
        remainingBoardsCount={0}
      />
    </div>
  );
}
