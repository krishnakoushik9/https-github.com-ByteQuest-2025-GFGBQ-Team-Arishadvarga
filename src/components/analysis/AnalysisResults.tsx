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
    Image as ImageIcon,
    Download
} from 'lucide-react';
import type { DiagnosticAnalysis } from '@/types/medical';
import { ClinicalVisualizer } from './ClinicalVisualizer';
import { ReasoningGraph } from './ReasoningGraph';

interface AnalysisResultsProps {
    analysis: DiagnosticAnalysis;
    onClose?: () => void;
}

export function AnalysisResults({ analysis, onClose }: AnalysisResultsProps) {
    const [activeTab, setActiveTab] = React.useState<'diagnoses' | 'visuals' | 'tests' | 'treatment' | 'reasoning'>('diagnoses');
    const [disclaimerAccepted, setDisclaimerAccepted] = React.useState(false);
    const [generatingPdf, setGeneratingPdf] = React.useState(false);
    const [handoutData, setHandoutData] = React.useState<any>(null);

    if (!disclaimerAccepted) {
        return (
            <DisclaimerModal
                disclaimer={analysis.disclaimers[0]}
                onAccept={() => setDisclaimerAccepted(true)}
            />
        );
    }

    const handleGenerateImage = async (type: 'anatomy' | 'heatmap' | 'progression' | 'cinematic', context: string) => {
        const res = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, context }),
        });
        const data = await res.json();
        return data.image; // Base64
    };



    const handleGenerateHandout = async () => {
        if (!analysis.differentialDiagnoses[0]) return;
        setGeneratingPdf(true);
        try {
            const res = await fetch('/api/patient-handout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    diagnosis: analysis.differentialDiagnoses[0].condition,
                    patientAge: "adult" // Can be passed from props if available
                }),
            });
            const data = await res.json();
            if (data.explanation) {
                setHandoutData(data.explanation);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate handout");
        } finally {
            setGeneratingPdf(false);
        }
    };

    const topDiagnosis = analysis.differentialDiagnoses[0];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col gap-6"
        >
            {/* Handout Modal */}
            {handoutData && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl relative">
                        <button
                            onClick={() => setHandoutData(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-slate-900">{handoutData.title}</h2>
                            <p className="text-slate-500 mt-2">Patient Education Sheet</p>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100">
                                <h3 className="font-semibold text-emerald-900 mb-2">Summary</h3>
                                <p className="text-emerald-800">{handoutData.summary}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-slate-900 mb-2">What is happening?</h3>
                                <p className="text-slate-600">{handoutData.whatHappens}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Do's</h3>
                                    <ul className="space-y-2">
                                        {handoutData.dosAndDonts?.do?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="text-emerald-500 font-bold">✓</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-3">Don'ts</h3>
                                    <ul className="space-y-2">
                                        {handoutData.dosAndDonts?.dont?.map((item: string, i: number) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                                <span className="text-red-500 font-bold">✕</span> {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                <h3 className="font-semibold text-red-900 flex items-center gap-2 mb-2">
                                    <AlertTriangle size={18} /> When to Call a Doctor
                                </h3>
                                <p className="text-red-800">{handoutData.whenToCall}</p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end gap-3">
                            <Button variant="outline" onClick={() => setHandoutData(null)}>Close</Button>
                            <Button onClick={() => window.print()}>Print / Save as PDF</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700">
                        <Brain size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-1">AI Clinical Analysis</h2>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            <Clock size={16} />
                            Analyzed at {new Date(analysis.analyzedAt).toLocaleString()}
                            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-xs font-semibold text-slate-600">
                                {analysis.modelVersion}
                            </span>
                        </p>
                    </div>
                </div>
                <Button variant="outline" onClick={handleGenerateHandout} disabled={generatingPdf}>
                    <Download size={16} className="mr-2" />
                    {generatingPdf ? 'Generating...' : 'Patient Handout'}
                </Button>
            </div>

            {/* Red Flags Section - Always visible if present */}
            {analysis.redFlags.length > 0 && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <AlertTriangle size={22} className="text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-red-900">Clinical Red Flags</h3>
                    </div>
                    <p className="text-sm text-red-700 mb-6">
                        {analysis.redFlags.length} potential concerns identified - requires clinical attention
                    </p>
                    <div className="flex flex-col gap-5">
                        {analysis.redFlags.map((flag) => (
                            <div key={flag.id} className="flex gap-4 p-5 bg-white rounded-xl border border-red-100 shadow-sm">
                                <AlertTriangle size={22} className="text-red-600 flex-shrink-0 mt-1" />
                                <div>
                                    <div className="font-semibold text-slate-900 mb-2 text-base leading-relaxed">{flag.description}</div>
                                    <div className="text-sm text-slate-600">
                                        <span className="font-medium">Action:</span> {flag.recommendedAction}
                                        <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-bold">
                                            {flag.severity.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
                {[
                    { id: 'diagnoses', label: 'Differential Diagnosis', icon: Stethoscope, count: analysis.differentialDiagnoses.length },
                    { id: 'visuals', label: 'Visual Analysis', icon: ImageIcon },
                    { id: 'tests', label: 'Suggested Tests', icon: TestTube, count: analysis.suggestedTests.length },
                    { id: 'treatment', label: 'Treatment Pathways', icon: FileText, count: analysis.treatmentPathways.length },
                    { id: 'reasoning', label: 'AI Reasoning', icon: Brain },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`
                            flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                            ${activeTab === tab.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}
                        `}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {tab.count !== undefined && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab.id ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
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
                        <div className="grid gap-6">
                            {analysis.differentialDiagnoses.map((dx) => (
                                <div key={dx.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-slate-900">{dx.condition}</h3>
                                                <Badge variant="info">{dx.probability}</Badge>
                                            </div>
                                            <p className="text-sm text-slate-500">Rank #{dx.rank} • Confidence: {dx.confidenceScore}%</p>
                                        </div>
                                        <div className="w-20 h-3 bg-slate-100 rounded-full overflow-hidden mt-2">
                                            <div
                                                className={`h-full rounded-full ${dx.probability === 'high' ? 'bg-emerald-500' : dx.probability === 'moderate' ? 'bg-amber-500' : 'bg-slate-400'}`}
                                                style={{ width: `${dx.confidenceScore}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                                            <h4 className="text-sm font-bold text-emerald-700 mb-4">Supported By</h4>
                                            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                                {dx.supportingEvidence.map((ev, i) => (
                                                    <li key={i} className="leading-relaxed">{ev.description}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-red-50/50 rounded-xl p-5 border border-red-100">
                                            <h4 className="text-sm font-bold text-red-700 mb-4">Arguments Against</h4>
                                            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
                                                {dx.contradictingEvidence.length > 0 ? (
                                                    dx.contradictingEvidence.map((ev, i) => <li key={i} className="leading-relaxed">{ev.description}</li>)
                                                ) : (
                                                    <li className="text-slate-400 italic">None identified</li>
                                                )}
                                            </ul>
                                        </div>
                                    </div>
                                    {dx.additionalConsiderations && (
                                        <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100 text-sm text-amber-800 leading-relaxed">
                                            <span className="font-semibold">Note:</span> {dx.additionalConsiderations}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'visuals' && topDiagnosis && (
                        <div className="space-y-6">
                            <ClinicalVisualizer
                                condition={topDiagnosis.condition}
                                description={`Patient presentation of ${topDiagnosis.condition}`}
                                onGenerate={handleGenerateImage}
                            />
                        </div>
                    )}

                    {activeTab === 'tests' && (
                        <div className="grid gap-6">
                            {analysis.suggestedTests.map((test) => (
                                <div key={test.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-5">
                                        <h4 className="font-bold text-xl text-slate-900 leading-snug pr-4">{test.testName}</h4>
                                        <Badge variant={test.priority === 'stat' ? 'error' : test.priority === 'urgent' ? 'warning' : 'default'}>
                                            {test.priority.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-base text-slate-600 mb-6 leading-relaxed">{test.rationale}</p>
                                    <div className="flex flex-wrap gap-3">
                                        <span className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-100">
                                            Category: {test.category}
                                        </span>
                                        {test.expectedToRule.in.length > 0 && (
                                            <span className="px-4 py-2 bg-sky-50 text-sky-700 rounded-xl text-sm font-medium border border-sky-100">
                                                Check for: {test.expectedToRule.in.join(', ')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'treatment' && (
                        <div className="grid gap-6">
                            {analysis.treatmentPathways.map((pathway) => (
                                <div key={pathway.id} className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <h4 className="font-bold text-xl text-slate-900">{pathway.condition}</h4>
                                            <Badge variant="outline">{pathway.pathway}</Badge>
                                        </div>
                                        <p className="text-base text-slate-600 leading-relaxed">{pathway.description}</p>
                                    </div>

                                    {pathway.considerations.length > 0 && (
                                        <div className="bg-slate-50 p-6 rounded-xl text-base text-slate-700 border border-slate-100">
                                            <strong className="text-slate-800">Considerations:</strong>
                                            <ul className="list-disc pl-5 mt-4 space-y-3">
                                                {pathway.considerations.map((c, i) => <li key={i} className="leading-relaxed">{c}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reasoning' && (
                        <div className="space-y-8">
                            <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 shadow-sm">
                                <h3 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full" />
                                    Analysis Summary
                                </h3>
                                <p className="text-base leading-relaxed text-slate-700">{analysis.reasoning.summaryText}</p>
                            </div>

                            <ReasoningGraph reasoning={analysis.reasoning} />
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
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-amber-100">
                        <Shield size={32} className="text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Clinical Decision Support</h2>
                        <p className="text-slate-500">Important Information</p>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 mb-6 max-h-64 overflow-y-auto">
                    <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {disclaimer}
                    </p>
                </div>

                <Button onClick={onAccept} className="w-full">
                    I Understand - View Analysis
                </Button>
            </motion.div>
        </motion.div>
    );
}
