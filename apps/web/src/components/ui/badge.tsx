import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2 py-0.5 text-[10px] font-medium uppercase font-mono tracking-wider transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        default:
          'border-zinc-700 bg-zinc-900 text-zinc-300',
        secondary:
          'border-zinc-800 bg-[#14151c] text-zinc-400',
        destructive:
          'border-red-900/60 bg-red-950/30 text-red-400',
        outline: 'border-zinc-800 text-zinc-400',
        privacy:
          'border-emerald-900/50 bg-emerald-950/20 text-emerald-400',
        active:
          'border-white/40 bg-white/10 text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
