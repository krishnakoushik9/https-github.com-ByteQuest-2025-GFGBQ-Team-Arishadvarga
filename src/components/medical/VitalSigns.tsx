'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { evaluateVitalSign } from '@/lib/utils';
import {
    Heart,
    Activity,
    Thermometer,
    Wind,
    Droplets,
} from 'lucide-react';

interface VitalSignCardProps {
    type: 'heart-rate' | 'blood-pressure' | 'temperature' | 'respiratory' | 'oxygen' | 'glucose';
    value: number | string;
    unit: string;
    label: string;
    trend?: 'up' | 'down' | 'stable';
    lastUpdated?: string;
}

const iconMap = {
    'heart-rate': Heart,
    'blood-pressure': Activity,
    'temperature': Thermometer,
    'respiratory': Wind,
    'oxygen': Droplets,
    'glucose': Droplets,
};

const vitalTypeToEvalType: Record<string, string> = {
    'heart-rate': 'heart-rate',
    'blood-pressure': 'bp-systolic',
    'temperature': 'temp-c',
    'respiratory': 'resp-rate',
    'oxygen': 'spo2',
    'glucose': 'heart-rate',
};

export function VitalSignCard({
    type,
    value,
    unit,
    label,
    trend,
    lastUpdated,
}: VitalSignCardProps) {
    const Icon = iconMap[type];
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;
    const evaluation = !isNaN(numericValue)
        ? evaluateVitalSign(vitalTypeToEvalType[type] as Parameters<typeof evaluateVitalSign>[0], numericValue)
        : { status: 'normal' as const, message: '' };

    const statusColors = {
        normal: { bg: '#ecfdf5', icon: '#10b981', border: '#a7f3d0', text: '#047857' },
        warning: { bg: '#fef3c7', icon: '#f59e0b', border: '#fcd34d', text: '#b45309' },
        critical: { bg: '#fee2e2', icon: '#ef4444', border: '#fca5a5', text: '#b91c1c' },
    };

    const colors = statusColors[evaluation.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: colors.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <Icon size={22} color={colors.icon} />
                </div>
                {trend && (
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 8px',
                        borderRadius: '12px',
                        background: trend === 'up' ? '#fee2e2' : trend === 'down' ? '#dbeafe' : '#f1f5f9',
                        color: trend === 'up' ? '#b91c1c' : trend === 'down' ? '#1d4ed8' : '#64748b',
                    }}>
                        {trend === 'up' ? '↑ Rising' : trend === 'down' ? '↓ Falling' : '→ Stable'}
                    </span>
                )}
            </div>

            <div style={{ marginBottom: '8px' }}>
                <span style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a' }}>{value}</span>
                <span style={{ fontSize: '14px', color: '#64748b', marginLeft: '6px' }}>{unit}</span>
            </div>

            <p style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>{label}</p>

            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '20px',
                background: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
            }}>
                <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: colors.icon,
                }} />
                {evaluation.status.charAt(0).toUpperCase() + evaluation.status.slice(1)}
            </div>

            {lastUpdated && (
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '12px' }}>{lastUpdated}</p>
            )}
        </motion.div>
    );
}

interface VitalSignsGridProps {
    vitals: {
        bloodPressure?: { systolic: number; diastolic: number };
        heartRate?: number;
        temperature?: number;
        respiratoryRate?: number;
        oxygenSaturation?: number;
    };
    lastUpdated?: string;
}

export function VitalSignsGrid({ vitals, lastUpdated }: VitalSignsGridProps) {
    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
        }}>
            {vitals.bloodPressure && (
                <VitalSignCard
                    type="blood-pressure"
                    value={`${vitals.bloodPressure.systolic}/${vitals.bloodPressure.diastolic}`}
                    unit="mmHg"
                    label="Blood Pressure"
                    lastUpdated={lastUpdated}
                />
            )}
            {vitals.heartRate && (
                <VitalSignCard
                    type="heart-rate"
                    value={vitals.heartRate}
                    unit="bpm"
                    label="Heart Rate"
                    lastUpdated={lastUpdated}
                />
            )}
            {vitals.temperature && (
                <VitalSignCard
                    type="temperature"
                    value={vitals.temperature}
                    unit="°C"
                    label="Temperature"
                    lastUpdated={lastUpdated}
                />
            )}
            {vitals.respiratoryRate && (
                <VitalSignCard
                    type="respiratory"
                    value={vitals.respiratoryRate}
                    unit="/min"
                    label="Respiratory Rate"
                    lastUpdated={lastUpdated}
                />
            )}
            {vitals.oxygenSaturation && (
                <VitalSignCard
                    type="oxygen"
                    value={vitals.oxygenSaturation}
                    unit="%"
                    label="SpO₂"
                    lastUpdated={lastUpdated}
                />
            )}
        </div>
    );
}
