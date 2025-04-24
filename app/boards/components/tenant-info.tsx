import { Tenant } from '@/types';

type TenantInfoProps = {
  data: Tenant;
};

export const TenantInfo = async ({ data: tenant }: TenantInfoProps) => {
  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-semibold">{tenant.name}</h2>
      </div>
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Private</span>
      </div>
    </div>
  );
};
