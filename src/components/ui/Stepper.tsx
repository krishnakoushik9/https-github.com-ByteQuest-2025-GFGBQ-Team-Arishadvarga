'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CaseWorkflowStep } from '@/types/medical';

interface Step {
    id: string;
    name: string;
    icon?: React.ComponentType<{ className?: string }>;
}

interface StepperProps {
    steps: Step[];
    currentStep: CaseWorkflowStep;
    completedSteps: CaseWorkflowStep[];
    onStepClick: (stepId: string) => void;
}

export function Stepper({ steps, currentStep, completedSteps, onStepClick }: StepperProps) {
    return (
        <div style={{ position: 'relative', overflowX: 'auto', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content' }}>
                {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id as CaseWorkflowStep);
                    const isCurrent = currentStep === step.id;
                    const isClickable = isCompleted || index <= steps.findIndex(s => s.id === currentStep);

                    return (
                        <React.Fragment key={step.id}>
                            <button
                                onClick={() => isClickable && onStepClick(step.id)}
                                disabled={!isClickable}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'transparent',
                                    border: 'none',
                                    padding: 0,
                                    cursor: isClickable ? 'pointer' : 'default',
                                    position: 'relative',
                                    zIndex: 10,
                                }}
                            >
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: isCompleted ? '#10b981' : isCurrent ? '#0f172a' : '#f1f5f9',
                                    color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: isCurrent ? '4px solid #e2e8f0' : 'none',
                                    transition: 'all 0.3s ease',
                                    flexShrink: 0,
                                }}>
                                    {isCompleted ? <Check size={16} /> : index + 1}
                                </div>
                                <span style={{
                                    fontSize: '14px',
                                    fontWeight: isCurrent ? 600 : 500,
                                    color: isCurrent ? '#0f172a' : isCompleted ? '#10b981' : '#64748b',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {step.name}
                                </span>
                            </button>

                            {index < steps.length - 1 && (
                                <div style={{
                                    flex: 1,
                                    height: '2px',
                                    background: isCompleted ? '#10b981' : '#e2e8f0',
                                    margin: '0 12px',
                                    minWidth: '40px',
                                    transition: 'background 0.3s ease',
                                }} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
}
