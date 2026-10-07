import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.99] cursor-pointer',
  {
    variants: {
      variant: {
        default:
          'bg-[#f5f5f7] text-[#08080a] font-semibold hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] shadow-sm',
        destructive:
          'bg-red-950/40 text-red-300 border border-red-900/50 hover:bg-red-900/50 hover:text-white',
        outline:
          'border border-zinc-800 bg-[#0d0e12]/80 hover:bg-zinc-800 hover:text-white text-zinc-300',
        secondary:
          'bg-[#181920] text-zinc-200 hover:bg-[#22242e] border border-zinc-800/60',
        ghost: 'hover:bg-zinc-900 text-zinc-400 hover:text-white',
        link: 'text-zinc-200 underline-offset-4 hover:underline lowercase normal-case',
        editorial:
          'bg-white text-black font-semibold hover:bg-zinc-200 tracking-editorial text-[11px] px-6 py-3',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-8 px-3.5 text-[11px]',
        lg: 'h-12 px-8 text-xs font-semibold tracking-editorial',
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
