'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const alertVariants = cva(
    'relative w-full rounded-xl p-5 flex gap-4',
    {
        variants: {
            variant: {
                default: 'bg-slate-50 border border-slate-200 text-slate-800',
                info: 'bg-blue-50 border border-blue-200 text-blue-900',
                success: 'bg-emerald-50 border border-emerald-200 text-emerald-900',
                warning: 'bg-amber-50 border border-amber-200 text-amber-900',
                error: 'bg-red-50 border border-red-200 text-red-900',
                critical: 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 text-red-900',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
);

const iconMap = {
    default: Info,
    info: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: XCircle,
    critical: AlertTriangle,
};

const iconColors = {
    default: 'text-slate-500',
    info: 'text-blue-500',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    error: 'text-red-500',
    critical: 'text-red-600',
};

export interface AlertProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
    title?: string;
    dismissible?: boolean;
    onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
    ({ className, variant = 'default', title, dismissible, onDismiss, children, ...props }, ref) => {
        const Icon = iconMap[variant || 'default'];

        return (
            <div
                ref={ref}
                role="alert"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                <div className={cn('flex-shrink-0 mt-0.5', iconColors[variant || 'default'])}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    {title && (
                        <h5 className="mb-1 font-semibold text-sm">{title}</h5>
                    )}
                    <div className="text-sm leading-relaxed opacity-90">{children}</div>
                </div>
                {dismissible && (
                    <button
                        onClick={onDismiss}
                        className="flex-shrink-0 p-1.5 rounded-lg hover:bg-black/5 transition-colors -mr-1.5 -mt-1.5"
                        aria-label="Dismiss alert"
                    >
                        <X className="h-4 w-4 opacity-60" />
                    </button>
                )}
            </div>
        );
    }
);
Alert.displayName = 'Alert';

export { Alert, alertVariants };
