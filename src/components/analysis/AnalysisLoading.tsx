'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
    Brain,
    Loader2,
    CheckCircle,
    AlertTriangle,
    Sparkles
} from 'lucide-react';

interface AnalysisLoadingProps {
    stage: 'preparing' | 'analyzing' | 'processing' | 'complete' | 'error';
    error?: string;
    onRetry?: () => void;
}

const stages = [
    { id: 'preparing', label: 'Preparing clinical data...', progress: 20 },
    { id: 'analyzing', label: 'AI analyzing patterns...', progress: 50 },
    { id: 'processing', label: 'Generating recommendations...', progress: 80 },
    { id: 'complete', label: 'Analysis complete', progress: 100 },
];

export function AnalysisLoading({ stage, error, onRetry }: AnalysisLoadingProps) {
    const currentStageIndex = stages.findIndex(s => s.id === stage);
    const currentStage = stages[currentStageIndex] || stages[0];

    if (stage === 'error') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center', padding: '48px 0' }}
            >
                <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px'
                }}>
                    <AlertTriangle size={40} color="#dc2626" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>Analysis Failed</h3>
                <p style={{ color: '#64748b', marginBottom: '24px' }}>{error || 'An unexpected error occurred during analysis.'}</p>
                {onRetry && (
                    <Button onClick={onRetry} variant="default">
                        Try Again
                    </Button>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ maxWidth: '512px', margin: '0 auto', padding: '64px 0' }}
        >
            {/* Animated Brain Icon */}
            <div style={{ position: 'relative', width: '128px', height: '128px', margin: '0 auto 32px' }}>
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        background: '#d1fae5',
                    }}
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    style={{
                        position: 'absolute',
                        inset: '16px',
                        borderRadius: '50%',
                        background: '#a7f3d0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Brain size={48} color="#059669" />
                </motion.div>

                {/* Floating particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: 'absolute',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#34d399',
                        }}
                        initial={{
                            x: 64,
                            y: 64,
                            opacity: 0,
                        }}
                        animate={{
                            x: 64 + Math.cos(i * 60 * Math.PI / 180) * 70,
                            y: 64 + Math.sin(i * 60 * Math.PI / 180) * 70,
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeOut',
                        }}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '32px' }}>
                <div style={{
                    height: '8px',
                    background: '#e2e8f0',
                    borderRadius: '9999px',
                    overflow: 'hidden',
                    marginBottom: '12px'
                }}>
                    <motion.div
                        style={{
                            height: '100%',
                            background: 'linear-gradient(to right, #10b981, #059669)',
                            borderRadius: '9999px',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${currentStage.progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <p style={{ textAlign: 'center', color: '#475569', fontWeight: 500 }}>
                    {currentStage.label}
                </p>
            </div>

            {/* Stage Indicators */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px' }}>
                {stages.slice(0, -1).map((s, index) => {
                    const isComplete = index < currentStageIndex;
                    const isCurrent = s.id === stage;

                    return (
                        <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.3s',
                                background: isComplete ? '#10b981' : isCurrent ? '#ecfdf5' : '#e2e8f0',
                                border: isCurrent ? '2px solid #10b981' : 'none',
                            }}>
                                {isComplete ? (
                                    <CheckCircle size={20} color="#ffffff" />
                                ) : isCurrent ? (
                                    <Loader2 size={20} color="#059669" className="animate-spin" />
                                ) : (
                                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{index + 1}</span>
                                )}
                            </div>
                            <span style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color: isComplete || isCurrent ? '#334155' : '#94a3b8'
                            }}>
                                {s.label.split('...')[0].split(' ')[0]}...
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Info Alert */}
            <div style={{ marginTop: '32px' }}>
                <Alert variant="info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={16} />
                        <span>AI is analyzing clinical patterns using advanced medical reasoning</span>
                    </div>
                </Alert>
            </div>
        </motion.div>
    );
}
