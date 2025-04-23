import { buttonVariants } from '@/components/ui/button';
import type { LayoutProps } from '@/types';
import { Zap } from '@/components/icons';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 hidden md:right-8 md:top-8'
        )}
      >
        Back to Home
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Zap />
          <span className="font-bold">Kanban</span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo; Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Donec pulvinar dolor vel metus viverra, in ullamcorper ipsum
              bibendum. Nulla facilisi. Sed auctor, ipsum id males &rdquo;
            </p>
            <footer className="text-sm">Random Artist</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">{children}</div>
    </div>
  );
}
