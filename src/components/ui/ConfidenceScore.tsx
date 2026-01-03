'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn, getConfidenceLabel } from '@/lib/utils';

interface ConfidenceScoreProps {
    score: number; // 0-100
    label?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    animate?: boolean;
}

export function ConfidenceScore({
    score,
    label,
    showPercentage = true,
    size = 'md',
    animate = true,
}: ConfidenceScoreProps) {
    const { label: confidenceLabel, color } = getConfidenceLabel(score);

    const sizes = {
        sm: { height: 'h-1.5', text: 'text-xs', gap: 'gap-1' },
        md: { height: 'h-2', text: 'text-sm', gap: 'gap-2' },
        lg: { height: 'h-3', text: 'text-base', gap: 'gap-3' },
    };

    const getBarColor = () => {
        if (score >= 80) return 'from-emerald-400 to-emerald-600';
        if (score >= 60) return 'from-amber-400 to-amber-600';
        if (score >= 40) return 'from-orange-400 to-orange-600';
        return 'from-red-400 to-red-600';
    };

    return (
        <div className={cn('w-full', sizes[size].gap)}>
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-1">
                    {label && (
                        <span className={cn('font-medium text-neutral-700', sizes[size].text)}>
                            {label}
                        </span>
                    )}
                    <div className={cn('flex items-center gap-2', sizes[size].text)}>
                        <span className={color}>{confidenceLabel}</span>
                        {showPercentage && (
                            <span className="font-semibold text-neutral-900">{score}%</span>
                        )}
                    </div>
                </div>
            )}
            <div className={cn('w-full bg-neutral-200 rounded-full overflow-hidden', sizes[size].height)}>
                <motion.div
                    className={cn('h-full rounded-full bg-gradient-to-r', getBarColor())}
                    initial={animate ? { width: 0 } : { width: `${score}%` }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}

interface ConfidenceRingProps {
    score: number;
    size?: number;
    strokeWidth?: number;
    showLabel?: boolean;
}

export function ConfidenceRing({
    score,
    size = 80,
    strokeWidth = 6,
    showLabel = true,
}: ConfidenceRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = () => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        if (score >= 40) return '#f97316';
        return '#ef4444';
    };

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-neutral-900">{score}%</span>
                </div>
            )}
        </div>
    );
}
