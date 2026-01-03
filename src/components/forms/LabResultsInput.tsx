'use client';

import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Plus, X, Upload, FileText, Beaker } from 'lucide-react';
import type { LabResult } from '@/types/medical';
import { generateId } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface LabResultsInputProps {
    results: LabResult[];
    onResultsChange: (results: LabResult[]) => void;
}

const COMMON_TESTS = [
    { name: 'Hemoglobin', unit: 'g/dL', normal: '12.0-15.5' },
    { name: 'WBC Count', unit: 'x10^9/L', normal: '4.5-11.0' },
    { name: 'Platelets', unit: 'x10^9/L', normal: '150-450' },
    { name: 'Glucose (Fasting)', unit: 'mg/dL', normal: '70-99' },
    { name: 'Creatinine', unit: 'mg/dL', normal: '0.74-1.35' },
    { name: 'Sodium', unit: 'mmol/L', normal: '135-145' },
    { name: 'Potassium', unit: 'mmol/L', normal: '3.5-5.0' },
    { name: 'CRP', unit: 'mg/L', normal: '<10' },
];

export function LabResultsInput({ results, onResultsChange }: LabResultsInputProps) {
    const [isAdding, setIsAdding] = React.useState(false);
    const [newTestName, setNewTestName] = React.useState('');
    const [newTestValue, setNewTestValue] = React.useState('');
    const [newTestUnit, setNewTestUnit] = React.useState('');
    const [newTestRange, setNewTestRange] = React.useState('');

    const handleAddResult = () => {
        if (newTestName && newTestValue) {
            onResultsChange([
                ...results,
                {
                    id: generateId(),
                    testName: newTestName,
                    value: parseFloat(newTestValue),
                    unit: newTestUnit,
                    referenceRange: { text: newTestRange },
                    status: 'normal',
                }
            ]);
            setNewTestName('');
            setNewTestValue('');
            setNewTestUnit('');
            setNewTestRange('');
            setIsAdding(false);
        }
    };

    const handleQuickAdd = (test: typeof COMMON_TESTS[0]) => {
        setNewTestName(test.name);
        setNewTestUnit(test.unit);
        setNewTestRange(test.normal);
        setIsAdding(true);
    };

    const removeResult = (id: string) => {
        onResultsChange(results.filter(r => r.id !== id));
    };

    return (
        <div className="space-y-6">
            <Card padding="lg">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>
                            Laboratory Results
                        </h3>
                        <p style={{ color: '#64748b', fontSize: '14px' }}>
                            Enter recent lab values manually or upload a report
                        </p>
                    </div>
                    <div style={{ padding: '8px', background: '#e0f2fe', borderRadius: '12px', color: '#0ea5e9' }}>
                        <Beaker size={24} />
                    </div>
                </div>

                {/* Quick Add Common Tests */}
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Common Tests
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {COMMON_TESTS.map(test => (
                            <button
                                key={test.name}
                                onClick={() => handleQuickAdd(test)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '20px',
                                    border: '1px solid #e2e8f0',
                                    background: '#ffffff',
                                    color: '#475569',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                                className="hover:bg-slate-50 hover:border-slate-300"
                            >
                                <Plus size={14} />
                                {test.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add New Result Form */}
                <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '20px', border: '1px dashed #cbd5e1', marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: '#334155' }}>Add Test Result</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                        <Input
                            placeholder="Test Name"
                            value={newTestName}
                            onChange={(e) => setNewTestName(e.target.value)}
                        />
                        <Input
                            type="number"
                            placeholder="Value"
                            value={newTestValue}
                            onChange={(e) => setNewTestValue(e.target.value)}
                        />
                        <Input
                            placeholder="Unit"
                            value={newTestUnit}
                            onChange={(e) => setNewTestUnit(e.target.value)}
                        />
                        <Input
                            placeholder="Range"
                            value={newTestRange}
                            onChange={(e) => setNewTestRange(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleAddResult}
                        disabled={!newTestName || !newTestValue}
                        size="sm"
                        leftIcon={<Plus size={16} />}
                    >
                        Add Result
                    </Button>
                </div>

                {/* Results List */}
                <div>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>
                        Recorded Values
                    </label>
                    {results.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '32px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <p style={{ fontSize: '14px', color: '#94a3b8' }}>No lab results added</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {results.map((result) => (
                                <div
                                    key={result.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        background: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div style={{ fontWeight: 600, color: '#0f172a', width: '140px' }}>{result.testName}</div>
                                        <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#0f172a', fontSize: '15px' }}>
                                            {result.value} <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 400 }}>{result.unit}</span>
                                        </div>
                                        {result.referenceRange && (
                                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                                (Ref: {result.referenceRange.text || `${result.referenceRange.low}-${result.referenceRange.high}`})
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => removeResult(result.id)}
                                        style={{ padding: '8px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                                        className="hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>

            <div style={{ paddingTop: '10px' }}>
                <Alert variant="info" title="Upload Capability">
                    You can also drag and drop PDF lab reports here in the full version to automatically extract values.
                </Alert>
            </div>
        </div>
    );
}
