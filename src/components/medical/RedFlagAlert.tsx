'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
    AlertTriangle,
    Clock,
    ArrowRight,
    Phone,
    Ambulance
} from 'lucide-react';
import type { RedFlag } from '@/types/medical';

interface RedFlagAlertProps {
    redFlag: RedFlag;
    onAction?: () => void;
    className?: string;
}

export function RedFlagAlert({ redFlag, onAction, className }: RedFlagAlertProps) {
    const severityConfig = {
        immediate: {
            bgColor: 'bg-red-50',
            borderColor: 'border-red-300',
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600',
            badgeVariant: 'error' as const,
            animation: true,
        },
        urgent: {
            bgColor: 'bg-amber-50',
            borderColor: 'border-amber-300',
            iconBg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            badgeVariant: 'warning' as const,
            animation: false,
        },
        soon: {
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-300',
            iconBg: 'bg-blue-100',
            iconColor: 'text-blue-600',
            badgeVariant: 'info' as const,
            animation: false,
        },
    };

    const config = severityConfig[redFlag.severity];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(
                'rounded-xl border-2 p-4',
                config.bgColor,
                config.borderColor,
                config.animation && 'animate-pulse',
                className
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn('p-2 rounded-lg flex-shrink-0', config.iconBg)}>
                    {redFlag.severity === 'immediate' ? (
                        <Ambulance className={cn('h-6 w-6', config.iconColor)} />
                    ) : (
                        <AlertTriangle className={cn('h-6 w-6', config.iconColor)} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant={config.badgeVariant} size="sm">
                            {redFlag.severity.toUpperCase()}
                        </Badge>
                        {redFlag.timeframe && (
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {redFlag.timeframe}
                            </span>
                        )}
                    </div>

                    <h4 className="font-semibold text-neutral-900 mb-1">
                        {redFlag.description}
                    </h4>

                    {redFlag.associatedCondition && (
                        <p className="text-sm text-neutral-600 mb-2">
                            Possible: <span className="font-medium">{redFlag.associatedCondition}</span>
                        </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                        <p className="text-sm text-neutral-700">
                            <span className="font-medium">Action: </span>
                            {redFlag.recommendedAction}
                        </p>

                        {onAction && redFlag.severity === 'immediate' && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={onAction}
                                rightIcon={<Phone className="h-4 w-4" />}
                            >
                                Emergency
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface RedFlagListProps {
    redFlags: RedFlag[];
    onEmergencyAction?: () => void;
}

export function RedFlagList({ redFlags, onEmergencyAction }: RedFlagListProps) {
    // Sort by severity: immediate > urgent > soon
    const sortedFlags = [...redFlags].sort((a, b) => {
        const order = { immediate: 0, urgent: 1, soon: 2 };
        return order[a.severity] - order[b.severity];
    });

    const hasImmediate = sortedFlags.some(f => f.severity === 'immediate');

    return (
        <div className="space-y-4">
            {hasImmediate && (
                <Alert variant="critical" title="Critical Alerts Detected">
                    Immediate clinical attention required. Review the following alerts carefully.
                </Alert>
            )}

            <div className="space-y-3">
                {sortedFlags.map((flag, index) => (
                    <RedFlagAlert
                        key={flag.id}
                        redFlag={flag}
                        onAction={flag.severity === 'immediate' ? onEmergencyAction : undefined}
                    />
                ))}
            </div>

            {sortedFlags.length === 0 && (
                <div className="text-center py-8 text-neutral-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-neutral-300" />
                    <p className="font-medium">No red flags identified</p>
                    <p className="text-sm">Continue with standard clinical assessment</p>
                </div>
            )}
        </div>
    );
}
