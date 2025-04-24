import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Breadcrumbs } from '@/components/common/breadcrumbs';
import { SearchInput } from '@/components/common/search-input';
import { ThemeToggle } from '@/components/common/theme-toggle';
import { UserProfile } from '@/components/common/user-profile';

export const Header = () => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-4 px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs />
      </div>

      <div className="hidden md:flex">
        <SearchInput />
      </div>

      <div className="flex items-center gap-4 px-4">
        <ThemeToggle />

        <UserProfile />
      </div>
    </header>
  );
};
