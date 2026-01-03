'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <LabelPrimitive.Root
                        htmlFor={inputId}
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                        {label}
                    </LabelPrimitive.Root>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900',
                            'placeholder:text-slate-400',
                            'transition-all duration-200',
                            'border-slate-200 hover:border-slate-300',
                            'focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/10',
                            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200',
                            error && 'border-red-300 focus:border-red-500 focus:ring-red-500/10',
                            leftIcon && 'pl-11',
                            rightIcon && 'pr-11',
                            className
                        )}
                        ref={ref}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                {error && (
                    <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600 font-medium">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${inputId}-hint`} className="mt-2 text-sm text-slate-500">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const textareaId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <LabelPrimitive.Root
                        htmlFor={textareaId}
                        className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                        {label}
                    </LabelPrimitive.Root>
                )}
                <textarea
                    id={textareaId}
                    className={cn(
                        'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900',
                        'placeholder:text-slate-400',
                        'transition-all duration-200 min-h-[120px] resize-y',
                        'flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:border-slate-300',
                        error && 'border-red-300 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    ref={ref}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
                    {...props}
                />
                {error && (
                    <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-600 font-medium">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${textareaId}-hint`} className="mt-2 text-sm text-slate-500">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);
Textarea.displayName = 'Textarea';

export { Input, Textarea };
