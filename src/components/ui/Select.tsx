'use client';

import * as React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectProps {
    label?: string;
    error?: string;
    placeholder?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    options: { value: string; label: string; disabled?: boolean }[];
    className?: string;
    disabled?: boolean;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
    ({ label, error, placeholder = 'Select an option', value, onValueChange, options, className, disabled }, ref) => {
        const selectId = React.useId();

        return (
            <div className={cn('w-full', className)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
                    <SelectPrimitive.Trigger
                        ref={ref}
                        id={selectId}
                        className={cn(
                            'flex h-10 w-full items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm',
                            'transition-all duration-200',
                            'focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20',
                            'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500',
                            error && 'border-red-500',
                            'data-[placeholder]:text-neutral-400'
                        )}
                        aria-invalid={!!error}
                    >
                        <SelectPrimitive.Value placeholder={placeholder} />
                        <SelectPrimitive.Icon>
                            <ChevronDown className="h-4 w-4 text-neutral-400" />
                        </SelectPrimitive.Icon>
                    </SelectPrimitive.Trigger>

                    <SelectPrimitive.Portal>
                        <SelectPrimitive.Content
                            className={cn(
                                'relative z-50 min-w-[8rem] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg',
                                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                                'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                                'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2'
                            )}
                            position="popper"
                            sideOffset={4}
                        >
                            <SelectPrimitive.Viewport className="p-1 max-h-[300px]">
                                {options.map((option) => (
                                    <SelectPrimitive.Item
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                        className={cn(
                                            'relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-4 text-sm outline-none',
                                            'focus:bg-emerald-50 focus:text-emerald-900',
                                            'data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                                        )}
                                    >
                                        <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
                                            <SelectPrimitive.ItemIndicator>
                                                <Check className="h-4 w-4 text-emerald-600" />
                                            </SelectPrimitive.ItemIndicator>
                                        </span>
                                        <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                                    </SelectPrimitive.Item>
                                ))}
                            </SelectPrimitive.Viewport>
                        </SelectPrimitive.Content>
                    </SelectPrimitive.Portal>
                </SelectPrimitive.Root>
                {error && (
                    <p className="mt-1.5 text-sm text-red-600">{error}</p>
                )}
            </div>
        );
    }
);
Select.displayName = 'Select';

export { Select };
