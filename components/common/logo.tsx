'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { useSidebar } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { type ComponentProps } from 'react';
import { SquareKanban } from '@/components/icons';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export const company = {
  name: 'Kanban',
  logo: SquareKanban,
  plan: 'for Indie Hackers',
};

// TODO: finish the logo design
export const logoVariants = cva(' cursor-pointer', {
  variants: {
    size: {
      xs: 'size-2',
      sm: 'size-4',
      md: 'size-6',
      lg: 'size-12',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

type BaseLogoProps = ComponentProps<'div'> & {
  base?: string;
} & VariantProps<typeof logoVariants>;

type LogoMarkProps = BaseLogoProps & {
  size?: 'xs' | 'sm' | 'md' | 'lg';
};

export const LogoMark = ({ base, className, size, ...rest }: LogoMarkProps) => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(base ?? '/')}
      className={cn(
        'bg-primary text-primary-foreground flex aspect-square size-8 cursor-pointer items-center justify-center rounded-lg'
      )}
      {...rest}
    >
      <company.logo className="size-4" />
    </div>
  );
};

type WordMarkProps = BaseLogoProps;
export const WordMark = ({ base, className, ...rest }: WordMarkProps) => {
  return (
    <div
      className={cn('grid flex-1 text-left text-sm leading-tight', className)}
      {...rest}
    >
      <Link href={base || '/'}>
        <span className="truncate font-semibold">{company.name}</span>
      </Link>
      <span className="truncate text-xs">{company.plan}</span>
    </div>
  );
};

type CollapsibleLogoProps = BaseLogoProps;
export const CollapsibleLogo = ({
  base,
  className,
  ...rest
}: CollapsibleLogoProps) => {
  const { state } = useSidebar();

  return (
    <div
      className={cn(
        'text-sidebar-accent-foreground flex gap-2 py-2',
        className
      )}
      {...rest}
    >
      <LogoMark base={base} />
      {state === 'collapsed' ? null : <WordMark base={base} />}
    </div>
  );
};

type StaticLogoProps = BaseLogoProps;
export const StaticLogo = ({ base, className, ...rest }: StaticLogoProps) => {
  return (
    <div
      className={cn(
        'text-sidebar-accent-foreground flex gap-2 py-2',
        className
      )}
      {...rest}
    >
      <LogoMark base={base} />
      <WordMark base={base} />
    </div>
  );
};

