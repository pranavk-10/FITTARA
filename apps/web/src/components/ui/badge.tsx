import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-sky-500/10 text-sky-400 border border-sky-500/20',
        secondary:
          'border-transparent bg-zinc-800 text-zinc-300 border border-zinc-700/50',
        destructive:
          'border-transparent bg-red-950/40 text-red-400 border border-red-800/40',
        outline: 'text-zinc-400 border-zinc-700',
        privacy:
          'bg-emerald-950/40 text-emerald-400 border-emerald-800/40 tracking-wider uppercase text-[10px] font-mono',
        warning:
          'bg-amber-950/40 text-amber-400 border-amber-800/40 font-mono text-[10px]',
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
