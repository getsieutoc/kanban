import { getTenantById } from '@/actions/tenants';
import { getAuth } from '@/auth';

export const TenantInfo = async () => {
  const { user } = await getAuth();
  const tenant = await getTenantById(user?.activeTenantId);

  return (
    <div className="flex flex-col items-center gap-0">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">{tenant?.name}</h2>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Private</span>
      </div>
    </div>
  );
};
