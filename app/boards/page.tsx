import { getBoardsFromTenant } from '@/actions/boards';
import { getTenantById } from '@/actions/tenants';
import { Button } from '@/components/ui/button';
import { getAuth } from '@/auth';

import { TenantInfo } from './components/tenant-info';
import { BoardList } from './components/board-list';

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

  const boards = await getBoardsFromTenant(activeTenant.id);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between">
        <TenantInfo data={activeTenant} />

        <Button
          variant="default"
          size="sm"
          className="bg-blue-500 hover:bg-blue-600"
        >
          Invite Workspace members
        </Button>
      </div>

      <BoardList boards={boards} />
    </div>
  );
}
