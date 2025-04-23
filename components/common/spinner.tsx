import { cva, type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

const spinnerVariants = cva('animate-spin', {
  variants: {
    // variant: {
    //   default:
    //     'bg-primary text-primary-foreground shadow hover:bg-primary/80',
    //   success:
    //     'bg-green-600 text-primary-foreground shadow hover:bg-green-600/80',
    //   info: 'bg-blue-600 text-primary-foreground shadow hover:bg-blue-600/80',
    //   warning:
    //     'bg-orange-600 text-primary-foreground shadow hover:bg-orange-600/80',
    //   destructive:
    //     'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/80',
    // },
    size: {
      xs: 'h-4 w-4',
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
      xl: 'h-12 w-12',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

function Spinner({
  className,
  size,
  ...props
}: React.ComponentProps<'svg'> &
  VariantProps<typeof spinnerVariants> & {
    asChild?: boolean;
  }) {
  return (
    <LoaderCircle
      data-slot="svg"
      className={cn(spinnerVariants({ size, className }))}
      {...props}
    />
  );
}

export { Spinner, spinnerVariants };
