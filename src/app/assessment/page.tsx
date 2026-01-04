'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Stepper } from '@/components/ui/Stepper';
import { PatientIntakeForm, type PatientIntakeData } from '@/components/forms/PatientIntakeForm';
import { SymptomInput } from '@/components/forms/SymptomInput';
import { LabResultsInput } from '@/components/forms/LabResultsInput';
import { VitalSignsGrid } from '@/components/medical/VitalSigns';
import { AnalysisResults } from '@/components/analysis/AnalysisResults';
import { AnalysisLoading } from '@/components/analysis/AnalysisLoading';
import { WhatIfSandbox } from '@/components/analysis/WhatIfSandbox';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { generateId } from '@/lib/utils';
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    Save,
    CheckCircle,
    Stethoscope,
    Activity,
    Beaker,
    FileText
} from 'lucide-react';
import type {
    Patient,
    ClinicalEncounter,
    MedicalHistory,
    LaboratoryPanel,
    LabResult,
    Symptom,
    VitalSigns,
    DiagnosticAnalysis,
    CaseWorkflowStep,
    ExistingCondition,
    Allergy,
    CurrentMedication
} from '@/types/medical';
import { saveClinicalCase } from '@/lib/db';
import { Alert } from '@/components/ui/Alert';

type AnalysisStage = 'preparing' | 'analyzing' | 'processing' | 'complete' | 'error';

export default function AssessmentPage() {
    // Navigation state
    const [currentStep, setCurrentStep] = React.useState<CaseWorkflowStep>('patient-info');
    const [completedSteps, setCompletedSteps] = React.useState<CaseWorkflowStep[]>([]);

    // Data state
    const [patient, setPatient] = React.useState<Patient | null>(null);
    const [encounter, setEncounter] = React.useState<ClinicalEncounter | null>(null);
    const [medicalHistory, setMedicalHistory] = React.useState<MedicalHistory | null>(null);
    const [labPanels, setLabPanels] = React.useState<LaboratoryPanel[]>([]);

    // Form input state
    const [symptoms, setSymptoms] = React.useState<Symptom[]>([]);
    const [chiefComplaint, setChiefComplaint] = React.useState('');
    const [labResults, setLabResults] = React.useState<LabResult[]>([]);
    const [vitals, setVitals] = React.useState<Partial<VitalSigns>>({});

    // History form state
    const [conditions, setConditions] = React.useState<ExistingCondition[]>([]);
    const [allergies, setAllergies] = React.useState<Allergy[]>([]);
    const [medications, setMedications] = React.useState<CurrentMedication[]>([]);
    const [smokingStatus, setSmokingStatus] = React.useState<'never' | 'former' | 'current'>('never');
    const [alcoholUse, setAlcoholUse] = React.useState<'none' | 'occasional' | 'moderate' | 'heavy'>('none');
    const [exerciseFrequency, setExerciseFrequency] = React.useState<'sedentary' | 'light' | 'moderate' | 'active'>('moderate');

    // AI Analysis state
    const [analysis, setAnalysis] = React.useState<DiagnosticAnalysis | null>(null);
    const [analysisStage, setAnalysisStage] = React.useState<AnalysisStage>('preparing');
    const [analysisError, setAnalysisError] = React.useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = React.useState(false);

    // NLP extraction state
    const [isExtractingSymptoms, setIsExtractingSymptoms] = React.useState(false);

    // Saving state
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveSuccess, setSaveSuccess] = React.useState(false);
    const [saveError, setSaveError] = React.useState<string | null>(null);

    const steps = [
        { id: 'patient-info', name: 'Patient Info', icon: FileText },
        { id: 'medical-history', name: 'History', icon: Activity },
        { id: 'symptoms', name: 'Symptoms', icon: Stethoscope },
        { id: 'vitals', name: 'Vitals', icon: Activity },
        { id: 'lab-results', name: 'Labs', icon: Beaker },
        { id: 'analysis', name: 'AI Analysis', icon: Brain },
    ];

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const goToNextStep = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            if (!completedSteps.includes(currentStep)) {
                setCompletedSteps([...completedSteps, currentStep]);
            }
            setCurrentStep(steps[nextIndex].id as CaseWorkflowStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToPreviousStep = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex].id as CaseWorkflowStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePatientSubmit = (data: PatientIntakeData) => {
        setPatient({
            id: generateId(),
            pseudonymizedId: data.pseudonymizedId,
            demographics: {
                ageRange: data.ageRange,
                biologicalSex: data.biologicalSex,
                heightCm: data.heightCm,
                weightKg: data.weightKg,
            },
            createdAt: new Date(),
            updatedAt: new Date(),
            consentGiven: data.consentGiven,
            consentTimestamp: new Date(),
        });
        goToNextStep();
    };

    const handleMedicalHistorySubmit = () => {
        if (!patient) return;
        setMedicalHistory({
            patientId: patient.id,
            conditions,
            allergies,
            medications,
            familyHistory: [],
            surgeries: [],
            lifestyle: { smokingStatus, alcoholUse, exerciseFrequency },
            lastUpdated: new Date(),
        });
        goToNextStep();
    };

    const handleSymptomsSubmit = () => {
        if (!patient) return;
        setEncounter({
            id: generateId(),
            patientId: patient.id,
            chiefComplaint,
            symptoms,
            vitals: { ...vitals, recordedAt: new Date() } as VitalSigns,
            createdAt: new Date(),
            status: 'in-progress',
        });
        goToNextStep();
    };

    const handleVitalsSubmit = () => {
        if (encounter) {
            setEncounter({
                ...encounter,
                vitals: { ...vitals, recordedAt: new Date() } as VitalSigns,
            });
        }
        goToNextStep();
    };

    const handleLabResultsSubmit = () => {
        if (labResults.length > 0) {
            setLabPanels([{
                id: generateId(),
                encounterId: encounter?.id || '',
                panelName: 'Clinical Tests',
                collectedAt: new Date(),
                results: labResults,
                status: 'complete',
            }]);
        }
        goToNextStep();
    };

    const handleNlpExtract = async (text: string) => {
        setIsExtractingSymptoms(true);
        try {
            const response = await fetch('/api/extract-symptoms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });
            const data = await response.json();
            if (data.success && data.symptoms) {
                setSymptoms(prev => {
                    const existing = new Set(prev.map(s => s.name.toLowerCase()));
                    const newSymps = data.symptoms.filter((s: Symptom) => !existing.has(s.name.toLowerCase()));
                    return [...prev, ...newSymps];
                });
            }
        } catch (error) {
            console.error('NLP Error:', error);
        } finally {
            setIsExtractingSymptoms(false);
        }
    };

    const runAnalysis = async () => {
        if (!patient || !encounter) return;

        setIsAnalyzing(true);
        setAnalysisStage('preparing');
        setAnalysisError(null);

        try {
            setAnalysisStage('analyzing');
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    patient,
                    encounter: { ...encounter, symptoms, vitals: { ...vitals, recordedAt: new Date() } },
                    history: medicalHistory,
                    labResults: labPanels,
                }),
            });

            setAnalysisStage('processing');
            const data = await response.json();

            if (data.success && data.analysis) {
                setAnalysis(data.analysis);
                setAnalysisStage('complete');
                if (!completedSteps.includes('analysis')) {
                    setCompletedSteps([...completedSteps, 'analysis']);
                }
            } else {
                throw new Error(data.error?.message || 'Analysis failed');
            }
        } catch (error) {
            setAnalysisError(error instanceof Error ? error.message : 'Unknown error');
            setAnalysisStage('error');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSaveCase = async () => {
        if (!patient || !encounter || !analysis) return;

        setIsSaving(true);
        setSaveError(null);

        try {
            const id = await saveClinicalCase(
                patient,
                encounter,
                medicalHistory,
                labPanels,
                analysis
            );
            console.log('Case saved with ID:', id);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error(err);
            setSaveError('Failed to save case. Please check connection and try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashboardLayout>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        New Clinical Assessment
                    </h1>
                    <p style={{ color: '#64748b' }}>
                        Complete the patient intake and receive AI-powered diagnostic support
                    </p>
                </div>

                {/* Stepper */}
                <div style={{ marginBottom: '40px' }}>
                    <Stepper
                        steps={steps}
                        currentStep={currentStep}
                        completedSteps={completedSteps}
                        onStepClick={(step) => {
                            const stepIndex = steps.findIndex(s => s.id === step);
                            if (stepIndex <= currentStepIndex || completedSteps.includes(steps[stepIndex - 1]?.id as CaseWorkflowStep)) {
                                setCurrentStep(step as CaseWorkflowStep);
                            }
                        }}
                    />
                </div>

                {/* Content Area */}
                <div style={{ minHeight: '400px', marginTop: '40px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
                        >
                            {currentStep === 'patient-info' && (
                                <PatientIntakeForm onSubmit={handlePatientSubmit} />
                            )}

                            {currentStep === 'medical-history' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {/* Conditions */}
                                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Existing Conditions</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {conditions.map((c, i) => (
                                                <div key={c.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <Input value={c.name} onChange={e => {
                                                        const newC = [...conditions];
                                                        newC[i].name = e.target.value;
                                                        setConditions(newC);
                                                    }} placeholder="Condition Name" />
                                                    <Button variant="ghost" size="icon-sm" onClick={() => setConditions(conditions.filter((_, idx) => idx !== i))}>×</Button>
                                                </div>
                                            ))}
                                            <Button variant="secondary" onClick={() => setConditions([...conditions, { id: generateId(), name: '', status: 'active' }])}>+ Add Condition</Button>
                                        </div>
                                    </div>

                                    {/* Navigation */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                        <Button variant="secondary" onClick={goToPreviousStep} leftIcon={<ArrowLeft size={16} />}>Back</Button>
                                        <Button onClick={handleMedicalHistorySubmit} rightIcon={<ArrowRight size={16} />}>Continue</Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'symptoms' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <SymptomInput
                                        symptoms={symptoms}
                                        onSymptomsChange={setSymptoms}
                                        chiefComplaint={chiefComplaint}
                                        onChiefComplaintChange={setChiefComplaint}
                                        isNlpProcessing={isExtractingSymptoms}
                                        onNlpProcess={handleNlpExtract}
                                    />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Button variant="secondary" onClick={goToPreviousStep} leftIcon={<ArrowLeft size={16} />}>Back</Button>
                                        <Button onClick={handleSymptomsSubmit} disabled={!chiefComplaint && symptoms.length === 0} rightIcon={<ArrowRight size={16} />}>Continue</Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'vitals' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ background: '#fff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Vital Signs</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Heart Rate (bpm)</label>
                                                <Input type="number" value={vitals.heartRate || ''} onChange={e => setVitals({ ...vitals, heartRate: Number(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">BP Systolic</label>
                                                <Input type="number" value={vitals.bloodPressureSystolic || ''} onChange={e => setVitals({ ...vitals, bloodPressureSystolic: Number(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">BP Diastolic</label>
                                                <Input type="number" value={vitals.bloodPressureDiastolic || ''} onChange={e => setVitals({ ...vitals, bloodPressureDiastolic: Number(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Temp (°C)</label>
                                                <Input type="number" value={vitals.temperature || ''} onChange={e => setVitals({ ...vitals, temperature: Number(e.target.value) })} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">SpO2 (%)</label>
                                                <Input type="number" value={vitals.oxygenSaturation || ''} onChange={e => setVitals({ ...vitals, oxygenSaturation: Number(e.target.value) })} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Button variant="secondary" onClick={goToPreviousStep} leftIcon={<ArrowLeft size={16} />}>Back</Button>
                                        <Button onClick={handleVitalsSubmit} rightIcon={<ArrowRight size={16} />}>Continue</Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'lab-results' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <LabResultsInput results={labResults} onResultsChange={setLabResults} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Button variant="secondary" onClick={goToPreviousStep} leftIcon={<ArrowLeft size={16} />}>Back</Button>
                                        <Button onClick={handleLabResultsSubmit} rightIcon={<ArrowRight size={16} />}>Proceed to Analysis</Button>
                                    </div>
                                </div>
                            )}

                            {currentStep === 'analysis' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    {!isAnalyzing && !analysis ? (
                                        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                            <div style={{ width: '64px', height: '64px', background: '#ecfdf5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                                                <Brain size={32} color="#10b981" />
                                            </div>
                                            <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px' }}>Ready to Analyze</h3>
                                            <p style={{ color: '#64748b', marginBottom: '32px', maxWidth: '400px', marginInline: 'auto' }}>
                                                Our AI engine will process the patient data to generate differential diagnoses and treatment suggestions.
                                            </p>
                                            <Button size="lg" onClick={() => runAnalysis()} leftIcon={<Brain size={20} />}>Run Clinical Analysis</Button>
                                        </div>
                                    ) : isAnalyzing ? (
                                        <AnalysisLoading stage={analysisStage} error={analysisError || undefined} onRetry={() => runAnalysis()} />
                                    ) : (
                                        <>
                                            <div className="mb-6">
                                                <WhatIfSandbox
                                                    initialVitals={vitals}
                                                    isSimulating={isAnalyzing}
                                                    onSimulate={(newVitals: Partial<VitalSigns>) => {
                                                        setVitals(newVitals);
                                                        // use setTimeout to ensure state update before running
                                                        setTimeout(() => runAnalysis(), 100);
                                                    }}
                                                />
                                            </div>
                                            <AnalysisResults analysis={analysis!} />
                                        </>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Button variant="secondary" onClick={goToPreviousStep} leftIcon={<ArrowLeft size={16} />}>Back</Button>

                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            {saveSuccess && (
                                                <span style={{ color: '#059669', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <CheckCircle size={16} /> Saved to Cloud
                                                </span>
                                            )}
                                            {saveError && (
                                                <span style={{ color: '#dc2626', fontSize: '14px', fontWeight: 500 }}>
                                                    {saveError}
                                                </span>
                                            )}
                                            {analysis && (
                                                <Button
                                                    onClick={handleSaveCase}
                                                    disabled={isSaving || saveSuccess}
                                                    leftIcon={isSaving ? <Activity className="animate-spin" size={16} /> : <Save size={16} />}
                                                >
                                                    {isSaving ? 'Saving...' : saveSuccess ? 'Saved' : 'Save Case'}
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </DashboardLayout>
    );
}
