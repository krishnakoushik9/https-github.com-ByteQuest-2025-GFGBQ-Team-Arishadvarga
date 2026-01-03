'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import {
    Brain,
    AlertTriangle,
    TestTube,
    Stethoscope,
    FileText,
    Clock,
    Shield,
} from 'lucide-react';
import type { DiagnosticAnalysis } from '@/types/medical';

interface AnalysisResultsProps {
    analysis: DiagnosticAnalysis;
    onClose?: () => void;
}

export function AnalysisResults({ analysis, onClose }: AnalysisResultsProps) {
    const [activeTab, setActiveTab] = React.useState<'diagnoses' | 'tests' | 'treatment' | 'reasoning'>('diagnoses');
    const [disclaimerAccepted, setDisclaimerAccepted] = React.useState(false);

    if (!disclaimerAccepted) {
        return (
            <DisclaimerModal
                disclaimer={analysis.disclaimers[0]}
                onAccept={() => setDisclaimerAccepted(true)}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}>
                        <Brain size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>AI Clinical Analysis</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={16} />
                            Analyzed at {new Date(analysis.analyzedAt).toLocaleString()}
                            <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600 }}>
                                {analysis.modelVersion}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Red Flags Section - Always visible if present */}
            {analysis.redFlags.length > 0 && (
                <div style={{ background: '#fef2f2', borderRadius: '16px', border: '1px solid #fecaca', padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <AlertTriangle size={20} color="#dc2626" />
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#7f1d1d' }}>Clinical Red Flags</h3>
                    </div>
                    <p style={{ fontSize: '14px', color: '#b91c1c', marginBottom: '16px' }}>
                        {analysis.redFlags.length} potential concerns identified - requires clinical attention
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {analysis.redFlags.map((flag) => (
                            <div key={flag.id} style={{ display: 'flex', gap: '12px', padding: '16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #fee2e2' }}>
                                <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{flag.description}</div>
                                    <div style={{ fontSize: '14px', color: '#64748b' }}>
                                        Action: {flag.recommendedAction} ({flag.severity.toUpperCase()})
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', overflowX: 'auto' }}>
                {[
                    { id: 'diagnoses', label: 'Differential Diagnosis', icon: Stethoscope, count: analysis.differentialDiagnoses.length },
                    { id: 'tests', label: 'Suggested Tests', icon: TestTube, count: analysis.suggestedTests.length },
                    { id: 'treatment', label: 'Treatment Pathways', icon: FileText, count: analysis.treatmentPathways.length },
                    { id: 'reasoning', label: 'AI Reasoning', icon: Brain },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 16px',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: 500,
                            border: 'none',
                            cursor: 'pointer',
                            background: activeTab === tab.id ? '#ecfdf5' : 'transparent',
                            color: activeTab === tab.id ? '#047857' : '#475569',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                        }}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '12px',
                                background: activeTab === tab.id ? '#d1fae5' : '#f1f5f9',
                                color: activeTab === tab.id ? '#047857' : '#64748b',
                                fontSize: '12px',
                                fontWeight: 700
                            }}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === 'diagnoses' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {analysis.differentialDiagnoses.map((dx) => (
                                <Card key={dx.id} padding="lg">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{dx.condition}</h3>
                                                <Badge variant="info">{dx.probability}</Badge>
                                            </div>
                                            <p style={{ color: '#475569', fontSize: '14px' }}>Rank #{dx.rank} • Confidence: {dx.confidenceScore}%</p>
                                        </div>
                                        <div style={{
                                            width: '64px',
                                            height: '8px',
                                            background: '#f1f5f9',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${dx.confidenceScore}%`,
                                                height: '100%',
                                                background: dx.probability === 'high' ? '#10b981' : dx.probability === 'moderate' ? '#f59e0b' : '#94a3b8'
                                            }} />
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#059669', marginBottom: '8px' }}>Supported By</h4>
                                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#334155' }}>
                                                {dx.supportingEvidence.map((ev, i) => (
                                                    <li key={i}>{ev.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#dc2626', marginBottom: '8px' }}>Arguments Against</h4>
                                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', fontSize: '14px', color: '#334155' }}>
                                                {dx.contradictingEvidence.length > 0 ? (
                                                    dx.contradictingEvidence.map((ev, i) => <li key={i}>{ev.description}</li>)
                                                ) : (
                                                    <li style={{ color: '#94a3b8', fontStyle: 'italic' }}>None identified</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {dx.additionalConsiderations && (
                                        <div style={{ marginTop: '16px', fontSize: '14px', color: '#64748b', fontStyle: 'italic' }}>
                                            Note: {dx.additionalConsiderations}
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'tests' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {analysis.suggestedTests.map((test) => (
                                <Card key={test.id} padding="lg">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{test.testName}</h4>
                                        <Badge variant={test.priority === 'stat' ? 'error' : test.priority === 'urgent' ? 'warning' : 'default'}>
                                            {test.priority.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>{test.rationale}</p>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '12px' }}>
                                        <div style={{ padding: '4px 8px', background: '#ecfdf5', color: '#047857', borderRadius: '6px' }}>
                                            Category: {test.category}
                                        </div>
                                        {test.expectedToRule.in.length > 0 && (
                                            <div style={{ padding: '4px 8px', background: '#f0f9ff', color: '#0369a1', borderRadius: '6px' }}>
                                                Check for: {test.expectedToRule.in.join(', ')}
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'treatment' && (
                        <div style={{ display: 'grid', gap: '16px' }}>
                            {analysis.treatmentPathways.map((pathway) => (
                                <Card key={pathway.id} padding="lg">
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                            <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a' }}>{pathway.condition}</h4>
                                            <Badge variant="outline">{pathway.pathway}</Badge>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#475569' }}>{pathway.description}</p>
                                    </div>

                                    {pathway.considerations.length > 0 && (
                                        <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', fontSize: '14px', color: '#334155' }}>
                                            <strong>Considerations:</strong>
                                            <ul style={{ listStyle: 'disc', paddingLeft: '20px', marginTop: '4px' }}>
                                                {pathway.considerations.map((c, i) => <li key={i}>{c}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reasoning' && (
                        <div style={{ display: 'grid', gap: '24px' }}>
                            <Card padding="lg">
                                <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '16px' }}>Analysis Summary</h3>
                                <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#334155' }}>{analysis.reasoning.summaryText}</p>
                            </Card>

                            <div style={{ position: 'relative', paddingLeft: '24px' }}>
                                <div style={{ position: 'absolute', left: '11px', top: 0, bottom: 0, width: '2px', background: '#e2e8f0' }} />
                                {analysis.reasoning.reasoningSteps.map((step) => (
                                    <div key={step.step} style={{ marginBottom: '24px', position: 'relative' }}>
                                        <div style={{
                                            position: 'absolute',
                                            left: '-24px',
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: '#10b981',
                                            color: '#fff',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '12px',
                                            fontWeight: 700,
                                            border: '4px solid #f8fafc'
                                        }}>
                                            {step.step}
                                        </div>
                                        <Card padding="md">
                                            <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Badge variant="outline">{step.category}</Badge>
                                            </div>
                                            <p style={{ fontSize: '14px', color: '#334155', marginBottom: '8px' }}>{step.description}</p>
                                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>
                                                → {step.conclusion}
                                            </div>
                                            {step.evidenceUsed.length > 0 && (
                                                <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                                                    Based on: {step.evidenceUsed.join(', ')}
                                                </div>
                                            )}
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Footer Disclaimer */}
            <Alert variant="warning" title="Clinical Decision Support">
                This analysis is intended to assist, not replace, clinical judgment.
                All recommendations require verification by a qualified healthcare provider.
            </Alert>
        </motion.div>
    );
}

function DisclaimerModal({
    disclaimer,
    onAccept
}: {
    disclaimer: string;
    onAccept: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                padding: '16px'
            }}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    maxWidth: '560px',
                    width: '100%',
                    padding: '32px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                    <div style={{ padding: '12px', borderRadius: '12px', background: '#fef3c7' }}>
                        <Shield size={32} color="#d97706" />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Clinical Decision Support</h2>
                        <p style={{ color: '#64748b' }}>Important Information</p>
                    </div>
                </div>

                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', marginBottom: '24px', maxHeight: '256px', overflowY: 'auto' }}>
                    <p style={{ fontSize: '14px', color: '#334155', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                        {disclaimer}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <Button onClick={onAccept} style={{ flex: 1 }}>
                        I Understand - View Analysis
                    </Button>
                </div>
            </motion.div>
        </motion.div>
    );
}
