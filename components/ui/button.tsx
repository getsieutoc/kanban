import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { type ComponentProps } from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow hover:bg-primary/80',
        success:
          'bg-green-600 text-primary-foreground shadow hover:bg-green-600/80',
        info: 'bg-blue-600 text-primary-foreground shadow hover:bg-blue-600/80',
        warning:
          'bg-orange-600 text-primary-foreground shadow hover:bg-orange-600/80',
        destructive:
          'bg-destructive text-primary-foreground hover:bg-destructive/80',
        outline:
          'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-3 text-sm text-sm',
        md: 'h-10 px-4 py-2 text-base',
        lg: 'h-12 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
