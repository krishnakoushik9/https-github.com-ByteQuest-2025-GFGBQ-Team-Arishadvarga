'use client';

import * as React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Clock, AlertTriangle, Search, Filter, ArrowRight, Brain, FileText } from 'lucide-react';
import { getAllCases, type SavedCase } from '@/lib/db';

export default function CasesPage() {
    const [cases, setCases] = React.useState<(SavedCase & { id: string })[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');

    React.useEffect(() => {
        async function fetchCases() {
            try {
                const fetchedCases = await getAllCases();
                setCases(fetchedCases);
            } catch (error) {
                console.error('Error fetching cases:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchCases();
    }, []);

    const filteredCases = cases.filter(c =>
        c.patient.pseudonymizedId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.encounter.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.analysis.differentialDiagnoses.some(d => d.condition.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Unknown';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (timestamp: any) => {
        if (!timestamp) return '';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        return `${diffDays} days ago`;
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Patient Cases</h1>
                        <p style={{ color: '#64748b' }}>
                            {cases.length} saved case{cases.length !== 1 ? 's' : ''} in the system
                        </p>
                    </div>
                    <Link href="/assessment">
                        <Button rightIcon={<ArrowRight size={16} />}>
                            New Assessment
                        </Button>
                    </Link>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text"
                            placeholder="Search by patient ID, complaint, or diagnosis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 14px 12px 44px',
                                borderRadius: '12px',
                                border: '1px solid #e2e8f0',
                                background: '#ffffff',
                                fontSize: '14px',
                                color: '#0f172a',
                                outline: 'none',
                            }}
                        />
                    </div>
                </div>

                {/* Cases List */}
                {loading ? (
                    <Card padding="xl">
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                border: '4px solid #e2e8f0',
                                borderTopColor: '#10b981',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 16px'
                            }} />
                            <p style={{ color: '#64748b' }}>Loading cases...</p>
                        </div>
                    </Card>
                ) : filteredCases.length === 0 ? (
                    <Card padding="xl">
                        <div style={{ textAlign: 'center', padding: '48px 0' }}>
                            <div style={{ width: '64px', height: '64px', background: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                <Users size={32} color="#94a3b8" />
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                                {searchTerm ? 'No Matching Cases' : 'No Cases Found'}
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '24px' }}>
                                {searchTerm ? 'Try a different search term.' : 'Start a new assessment to see patient cases here.'}
                            </p>
                            {!searchTerm && (
                                <Link href="/assessment">
                                    <Button>Start New Assessment</Button>
                                </Link>
                            )}
                        </div>
                    </Card>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredCases.map((caseData) => (
                            <Card key={caseData.id} padding="lg" hover>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                                    {/* Priority indicator */}
                                    <div style={{
                                        width: '4px',
                                        height: '100%',
                                        minHeight: '80px',
                                        borderRadius: '4px',
                                        background: caseData.analysis.redFlags.length > 0 ? '#ef4444' : '#10b981',
                                        flexShrink: 0
                                    }} />

                                    {/* Main content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        {/* Header row */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontFamily: 'monospace',
                                                fontSize: '12px',
                                                color: '#64748b',
                                                background: '#f1f5f9',
                                                padding: '4px 10px',
                                                borderRadius: '6px',
                                                fontWeight: 600
                                            }}>
                                                {caseData.patient.pseudonymizedId}
                                            </span>
                                            <Badge variant="success">Completed</Badge>
                                            {caseData.analysis.redFlags.length > 0 && (
                                                <Badge variant="error">
                                                    <AlertTriangle size={12} style={{ marginRight: '4px' }} />
                                                    {caseData.analysis.redFlags.length} Red Flag{caseData.analysis.redFlags.length > 1 ? 's' : ''}
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Chief complaint */}
                                        <h3 style={{
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#0f172a',
                                            marginBottom: '8px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {caseData.encounter.chiefComplaint}
                                        </h3>

                                        {/* Diagnoses */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                                            {caseData.analysis.differentialDiagnoses.slice(0, 3).map((dx, i) => (
                                                <span key={i} style={{
                                                    fontSize: '12px',
                                                    padding: '4px 10px',
                                                    borderRadius: '20px',
                                                    background: i === 0 ? '#ecfdf5' : '#f1f5f9',
                                                    color: i === 0 ? '#047857' : '#475569',
                                                    fontWeight: 500
                                                }}>
                                                    {dx.condition} ({dx.confidenceScore}%)
                                                </span>
                                            ))}
                                            {caseData.analysis.differentialDiagnoses.length > 3 && (
                                                <span style={{ fontSize: '12px', color: '#94a3b8', padding: '4px 0' }}>
                                                    +{caseData.analysis.differentialDiagnoses.length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#64748b' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Clock size={14} />
                                                {getTimeAgo(caseData.savedAt)}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <Brain size={14} />
                                                {caseData.analysis.differentialDiagnoses.length} diagnoses
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <FileText size={14} />
                                                {caseData.analysis.suggestedTests.length} tests suggested
                                            </span>
                                        </div>
                                    </div>

                                    {/* Demographics */}
                                    <div style={{
                                        textAlign: 'right',
                                        flexShrink: 0,
                                        fontSize: '13px',
                                        color: '#64748b'
                                    }}>
                                        <div style={{ fontWeight: 500, color: '#334155' }}>
                                            {caseData.patient.demographics.ageRange}
                                        </div>
                                        <div style={{ textTransform: 'capitalize' }}>
                                            {caseData.patient.demographics.biologicalSex}
                                        </div>
                                        <div style={{ marginTop: '8px', fontSize: '12px' }}>
                                            {formatDate(caseData.savedAt).split(',')[0]}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
