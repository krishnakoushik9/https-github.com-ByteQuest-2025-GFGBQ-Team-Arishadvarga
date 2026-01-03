'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'bordered' | 'glass' | 'gradient';
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', hover = false, padding = 'lg', children, ...props }, ref) => {
        const variants = {
            default: 'bg-white border border-slate-100 shadow-[0_2px_8px_rgba(15,23,42,0.04)]',
            elevated: 'bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border-0',
            bordered: 'bg-white border-2 border-slate-200',
            glass: 'bg-white/70 backdrop-blur-xl border border-white/60 shadow-lg',
            gradient: 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/80 shadow-sm',
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            md: 'p-5',
            lg: 'p-6',
            xl: 'p-8',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-[24px] transition-all duration-300',
                    variants[variant],
                    paddings[padding],
                    hover && 'cursor-pointer hover:shadow-xl hover:shadow-slate-900/10 hover:-translate-y-1 hover:border-slate-300',
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-2 pb-6', className)}
            {...props}
        />
    )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-lg font-semibold leading-none tracking-tight text-slate-900', className)}
            {...props}
        />
    )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-slate-500 leading-relaxed', className)}
            {...props}
        />
    )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-6 mt-6 border-t border-slate-100', className)}
            {...props}
        />
    )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
