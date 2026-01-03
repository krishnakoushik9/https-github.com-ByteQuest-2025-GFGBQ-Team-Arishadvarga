'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Brain, Plus, X, Search, Sparkles } from 'lucide-react';
import type { Symptom } from '@/types/medical';
import { generateId } from '@/lib/utils';

// Common symptoms for quick add
const COMMON_SYMPTOMS = [
    'Fever', 'Cough', 'Fatigue', 'Headache', 'Nausea',
    'Dizziness', 'Shortness of breath', 'Chest pain'
];

interface SymptomInputProps {
    symptoms: Symptom[];
    onSymptomsChange: (symptoms: Symptom[]) => void;
    chiefComplaint: string;
    onChiefComplaintChange: (value: string) => void;
    isNlpProcessing: boolean;
    onNlpProcess: (text: string) => void;
}

export function SymptomInput({
    symptoms,
    onSymptomsChange,
    chiefComplaint,
    onChiefComplaintChange,
    isNlpProcessing,
    onNlpProcess,
}: SymptomInputProps) {
    const [searchTerm, setSearchTerm] = React.useState('');

    const handleAddSymptom = (name: string) => {
        if (!symptoms.find(s => s.name.toLowerCase() === name.toLowerCase())) {
            onSymptomsChange([
                ...symptoms,
                {
                    id: generateId(),
                    name,
                    onset: 'unknown',
                    duration: 'Not specified',
                    severity: 5,
                }
            ]);
        }
        setSearchTerm('');
    };

    const handleRemoveSymptom = (id: string) => {
        onSymptomsChange(symptoms.filter(s => s.id !== id));
    };

    const handleSeverityChange = (id: string, severity: number) => {
        onSymptomsChange(symptoms.map(s =>
            s.id === id ? { ...s, severity: severity as any } : s
        ));
    };

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                            Chief Complaint & Symptoms
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Describe the patient's primary reason for visit and associated symptoms
                        </p>
                    </div>
                    <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '12px', color: '#10b981' }}>
                        <Brain size={24} />
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontSize: '14px', fontWeight: 600, color: '#334155' }}>
                                Main Symptoms / Description
                            </label>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onNlpProcess(chiefComplaint)}
                                disabled={!chiefComplaint || isNlpProcessing}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                rightIcon={<Sparkles size={14} />}
                            >
                                {isNlpProcessing ? 'Analyzing...' : 'Auto-Extract Symptoms'}
                            </Button>
                        </div>

                        <Textarea
                            value={chiefComplaint}
                            onChange={(e) => onChiefComplaintChange(e.target.value)}
                            placeholder="e.g., Patient complains of severe headache for 3 days accompanied by nausea and light sensitivity..."
                            className="min-h-[120px]"
                        />
                        {chiefComplaint && !isNlpProcessing && symptoms.length === 0 && (
                            <p className="text-xs text-slate-500 mt-2">
                                Tip: Click &quot;Auto-Extract Symptoms&quot; to let AI identify clinical terms from your description.
                            </p>
                        )}
                    </div>

                    <div style={{ height: '1px', background: '#e2e8f0' }} />

                    <div>
                        <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                            Documented Symptoms
                        </label>

                        <div style={{ position: 'relative', marginBottom: '16px' }}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search or add symptoms..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && searchTerm) {
                                        e.preventDefault();
                                        handleAddSymptom(searchTerm);
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    padding: '10px 10px 10px 36px',
                                    borderRadius: '12px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        {/* Common Symptoms Helpers */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                            {COMMON_SYMPTOMS.map(sym => (
                                <button
                                    key={sym}
                                    type="button"
                                    onClick={() => handleAddSymptom(sym)}
                                    style={{
                                        padding: '6px 12px',
                                        borderRadius: '20px',
                                        border: '1px solid #e2e8f0',
                                        background: '#f8fafc',
                                        color: '#64748b',
                                        fontSize: '12px',
                                        fontWeight: 500,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                    className="hover:bg-slate-100 hover:border-slate-300"
                                >
                                    + {sym}
                                </button>
                            ))}
                        </div>

                        {/* Selected Symptoms List */}
                        <div className="space-y-3">
                            {symptoms.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '32px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #e2e8f0' }}>
                                    <p style={{ fontSize: '14px', color: '#94a3b8' }}>No symptoms added yet</p>
                                </div>
                            ) : (
                                symptoms.map((symptom) => (
                                    <div
                                        key={symptom.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '12px 16px',
                                            background: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                                        }}
                                    >
                                        <div style={{ flex: 1, fontWeight: 600, color: '#0f172a' }}>
                                            {symptom.name}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <select
                                                value={symptom.severity}
                                                onChange={(e) => handleSeverityChange(symptom.id, parseInt(e.target.value))}
                                                style={{
                                                    padding: '4px 8px',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e2e8f0',
                                                    fontSize: '12px',
                                                    color: '#475569',
                                                    outline: 'none',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                    <option key={num} value={num}>{num} - {num <= 3 ? 'Mild' : num <= 7 ? 'Moderate' : 'Severe'}</option>
                                                ))}
                                            </select>

                                            <button
                                                onClick={() => handleRemoveSymptom(symptom.id)}
                                                style={{
                                                    padding: '6px',
                                                    borderRadius: '8px',
                                                    color: '#94a3b8',
                                                    cursor: 'pointer',
                                                    background: 'transparent',
                                                    border: 'none',
                                                }}
                                                className="hover:text-red-500 hover:bg-red-50"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}
