'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2.5 rounded-full text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
    {
        variants: {
            variant: {
                default:
                    'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:from-emerald-600 hover:to-emerald-700 focus-visible:ring-emerald-500 border-t border-white/20',
                secondary:
                    'bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 hover:border-slate-300 focus-visible:ring-slate-400',
                outline:
                    'border-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-400',
                ghost:
                    'text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-slate-400',
                destructive:
                    'bg-gradient-to-b from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:from-red-600 hover:to-red-700 focus-visible:ring-red-500',
                success:
                    'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:ring-emerald-500',
                warning:
                    'bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/30 focus-visible:ring-amber-500',
                link:
                    'text-emerald-600 underline-offset-4 hover:underline p-0 h-auto',
            },
            size: {
                default: 'h-11 px-5',
                sm: 'h-9 px-4 text-xs',
                lg: 'h-12 px-7 text-base',
                xl: 'h-14 px-8 text-base',
                icon: 'h-11 w-11',
                'icon-sm': 'h-9 w-9',
                'icon-lg': 'h-12 w-12',
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
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : leftIcon ? (
                    <span className="flex-shrink-0">{leftIcon}</span>
                ) : null}
                {children}
                {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </button>
        );
    }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
