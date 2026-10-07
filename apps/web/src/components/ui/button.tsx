import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow hover:from-sky-400 hover:to-blue-500 shadow-sky-950/50',
        destructive:
          'bg-red-950/50 text-red-400 border border-red-800/60 hover:bg-red-900/60 hover:text-red-200',
        outline:
          'border border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:text-white text-zinc-300 backdrop-blur-sm',
        secondary:
          'bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80 border border-zinc-700/40',
        ghost: 'hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-100',
        link: 'text-sky-400 underline-offset-4 hover:underline',
        editorial:
          'bg-white text-black font-semibold hover:bg-zinc-200 tracking-wide uppercase text-xs px-6 py-3',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-lg px-8 text-base font-semibold',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
