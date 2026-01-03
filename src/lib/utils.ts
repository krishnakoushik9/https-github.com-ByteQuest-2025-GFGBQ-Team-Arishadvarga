/**
 * CDSS - Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
    return crypto.randomUUID();
}

/**
 * Generate a pseudonymized patient ID (GDPR-compliant)
 */
export function generatePseudonymizedId(): string {
    const prefix = 'PAT';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
}

/**
 * Format date for display
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    switch (format) {
        case 'long':
            return d.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        case 'iso':
            return d.toISOString();
        default:
            return d.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
    }
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(d);
}

/**
 * Calculate BMI
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
    const heightM = heightCm / 100;
    return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): { category: string; risk: 'low' | 'moderate' | 'high' } {
    if (bmi < 18.5) return { category: 'Underweight', risk: 'moderate' };
    if (bmi < 25) return { category: 'Normal weight', risk: 'low' };
    if (bmi < 30) return { category: 'Overweight', risk: 'moderate' };
    return { category: 'Obese', risk: 'high' };
}

/**
 * Evaluate vital signs against normal ranges
 */
export function evaluateVitalSign(
    type: 'bp-systolic' | 'bp-diastolic' | 'heart-rate' | 'resp-rate' | 'temp-c' | 'spo2',
    value: number
): { status: 'normal' | 'warning' | 'critical'; message: string } {
    const ranges: Record<typeof type, { low: number; high: number; criticalLow?: number; criticalHigh?: number }> = {
        'bp-systolic': { low: 90, high: 140, criticalLow: 80, criticalHigh: 180 },
        'bp-diastolic': { low: 60, high: 90, criticalLow: 50, criticalHigh: 120 },
        'heart-rate': { low: 60, high: 100, criticalLow: 40, criticalHigh: 150 },
        'resp-rate': { low: 12, high: 20, criticalLow: 8, criticalHigh: 30 },
        'temp-c': { low: 36.1, high: 37.2, criticalLow: 35, criticalHigh: 39.5 },
        'spo2': { low: 95, high: 100, criticalLow: 90, criticalHigh: 101 },
    };

    const range = ranges[type];

    if (range.criticalLow && value < range.criticalLow) {
        return { status: 'critical', message: 'Critically low - immediate attention required' };
    }
    if (range.criticalHigh && value > range.criticalHigh) {
        return { status: 'critical', message: 'Critically high - immediate attention required' };
    }
    if (value < range.low) {
        return { status: 'warning', message: 'Below normal range' };
    }
    if (value > range.high) {
        return { status: 'warning', message: 'Above normal range' };
    }
    return { status: 'normal', message: 'Within normal range' };
}

/**
 * Confidence score to label
 */
export function getConfidenceLabel(score: number): { label: string; color: string } {
    if (score >= 80) return { label: 'High', color: 'text-emerald-600' };
    if (score >= 60) return { label: 'Moderate', color: 'text-amber-600' };
    if (score >= 40) return { label: 'Low', color: 'text-orange-600' };
    return { label: 'Very Low', color: 'text-red-600' };
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Sanitize user input (basic XSS prevention)
 */
export function sanitizeInput(input: string): string {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Convert Lab result status to display text
 */
export function getLabStatusDisplay(status: string): { text: string; className: string } {
    const statusMap: Record<string, { text: string; className: string }> = {
        'normal': { text: 'Normal', className: 'badge-success' },
        'abnormal-low': { text: 'Low', className: 'badge-warning' },
        'abnormal-high': { text: 'High', className: 'badge-warning' },
        'critical-low': { text: 'Critical Low', className: 'badge-error' },
        'critical-high': { text: 'Critical High', className: 'badge-error' },
    };
    return statusMap[status] || { text: status, className: '' };
}

/**
 * Generate audit log entry ID
 */
export function generateAuditId(): string {
    return `AUD-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Local storage helpers with error handling
 */
export const storage = {
    get: <T>(key: string, defaultValue: T): T => {
        if (typeof window === 'undefined') return defaultValue;
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch {
            return defaultValue;
        }
    },
    set: <T>(key: string, value: T): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Storage set error:', error);
        }
    },
    remove: (key: string): void => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    },
};
