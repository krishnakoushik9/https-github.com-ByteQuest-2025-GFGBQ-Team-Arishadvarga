/**
 * CDSS - Clinical Decision Support System
 * Core Medical Type Definitions
 * GDPR-aware, Audit-friendly, Explainable AI
 */

// ============================================
// Patient & Demographics
// ============================================

export interface Patient {
    id: string;
    pseudonymizedId: string; // GDPR: No direct identifiers stored
    demographics: Demographics;
    createdAt: Date;
    updatedAt: Date;
    consentGiven: boolean;
    consentTimestamp?: Date;
}

export interface Demographics {
    ageRange: AgeRange; // Using ranges instead of exact age for privacy
    biologicalSex: BiologicalSex;
    heightCm?: number;
    weightKg?: number;
    bmi?: number;
}

export type AgeRange =
    | '0-17'
    | '18-29'
    | '30-39'
    | '40-49'
    | '50-59'
    | '60-69'
    | '70-79'
    | '80+';

export type BiologicalSex = 'male' | 'female' | 'other' | 'not-specified';

// ============================================
// Medical History
// ============================================

export interface MedicalHistory {
    patientId: string;
    conditions: ExistingCondition[];
    allergies: Allergy[];
    medications: CurrentMedication[];
    familyHistory: FamilyHistoryItem[];
    surgeries: Surgery[];
    lifestyle: LifestyleFactors;
    lastUpdated: Date;
}

export interface ExistingCondition {
    id: string;
    icdCode?: string;
    name: string;
    diagnosedDate?: string;
    status: 'active' | 'resolved' | 'chronic';
    notes?: string;
}

export interface Allergy {
    id: string;
    allergen: string;
    type: 'medication' | 'food' | 'environmental' | 'other';
    severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
    reaction?: string;
}

export interface CurrentMedication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate?: string;
    prescribedFor?: string;
}

export interface FamilyHistoryItem {
    id: string;
    condition: string;
    relation: 'parent' | 'sibling' | 'grandparent' | 'other';
    notes?: string;
}

export interface Surgery {
    id: string;
    procedure: string;
    date: string;
    outcome?: string;
}

export interface LifestyleFactors {
    smokingStatus: 'never' | 'former' | 'current';
    alcoholUse: 'none' | 'occasional' | 'moderate' | 'heavy';
    exerciseFrequency: 'sedentary' | 'light' | 'moderate' | 'active';
    dietType?: string;
    occupation?: string;
}

// ============================================
// Clinical Encounter & Symptoms
// ============================================

export interface ClinicalEncounter {
    id: string;
    patientId: string;
    chiefComplaint: string;
    symptoms: Symptom[];
    vitals: VitalSigns;
    physicalExamFindings?: string;
    clinicianNotes?: string;
    createdAt: Date;
    status: 'in-progress' | 'completed' | 'reviewed';
}

export interface Symptom {
    id: string;
    name: string;
    description?: string;
    onset: SymptomOnset;
    duration: string;
    severity: SeverityLevel;
    location?: string;
    characteristics?: string[];
    aggravatingFactors?: string[];
    relievingFactors?: string[];
    associatedSymptoms?: string[];
    nlpExtracted?: boolean; // Flag for NLP-processed symptoms
    confidence?: number; // NLP extraction confidence
}

export type SymptomOnset = 'sudden' | 'gradual' | 'unknown';
export type SeverityLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface VitalSigns {
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    temperatureUnit?: 'celsius' | 'fahrenheit';
    oxygenSaturation?: number;
    glucoseLevel?: number;
    painLevel?: SeverityLevel;
    recordedAt: Date;
}

// ============================================
// Laboratory Results
// ============================================

export interface LaboratoryPanel {
    id: string;
    encounterId: string;
    panelName: string;
    collectedAt: Date;
    results: LabResult[];
    status: 'pending' | 'partial' | 'complete';
}

export interface LabResult {
    id: string;
    testName: string;
    testCode?: string;
    value: number | string;
    unit: string;
    referenceRange: ReferenceRange;
    status: LabResultStatus;
    interpretation?: string;
    flags?: LabFlag[];
}

export interface ReferenceRange {
    low?: number;
    high?: number;
    text?: string;
}

export type LabResultStatus = 'normal' | 'abnormal-low' | 'abnormal-high' | 'critical-low' | 'critical-high';
export type LabFlag = 'critical' | 'abnormal' | 'delta-check' | 'repeat-recommended';

// ============================================
// AI Diagnostic Support
// ============================================

export interface DiagnosticAnalysis {
    id: string;
    encounterId: string;
    analyzedAt: Date;
    differentialDiagnoses: DifferentialDiagnosis[];
    redFlags: RedFlag[];
    suggestedTests: SuggestedTest[];
    treatmentPathways: TreatmentPathway[];
    reasoning: ExplainableReasoning;
    modelVersion: string;
    disclaimers: string[];
    auditTrail: AuditEntry[];
}

export interface DifferentialDiagnosis {
    id: string;
    rank: number;
    condition: string;
    icdCode?: string;
    confidenceScore: number; // 0-100
    probability: 'high' | 'moderate' | 'low';
    supportingEvidence: Evidence[];
    contradictingEvidence: Evidence[];
    additionalConsiderations?: string;
}

export interface Evidence {
    type: 'symptom' | 'vital' | 'lab' | 'history' | 'medication' | 'demographic';
    description: string;
    weight: 'strong' | 'moderate' | 'weak';
    sourceId?: string;
}

export interface RedFlag {
    id: string;
    severity: 'immediate' | 'urgent' | 'soon';
    description: string;
    associatedCondition?: string;
    recommendedAction: string;
    timeframe?: string;
}

export interface SuggestedTest {
    id: string;
    testName: string;
    testCode?: string;
    category: 'laboratory' | 'imaging' | 'procedure' | 'specialist-referral';
    priority: 'stat' | 'urgent' | 'routine';
    rationale: string;
    expectedToRule: {
        in: string[];
        out: string[];
    };
}

export interface TreatmentPathway {
    id: string;
    condition: string;
    pathway: 'first-line' | 'second-line' | 'alternative';
    description: string;
    guidelineReference?: GuidelineReference;
    considerations: string[];
    contraindications?: string[];
    monitoringRequirements?: string[];
}

export interface GuidelineReference {
    name: string;
    organization: string;
    version?: string;
    url?: string;
    publicationDate?: string;
}

// ============================================
// Explainable AI / Reasoning
// ============================================

export interface ExplainableReasoning {
    summaryText: string;
    reasoningSteps: ReasoningStep[];
    dataSourcesUsed: DataSource[];
    limitations: string[];
    uncertaintyFactors: string[];
}

export interface ReasoningStep {
    step: number;
    category: string;
    description: string;
    evidenceUsed: string[];
    conclusion: string;
    confidence?: number;
}

export interface DataSource {
    type: 'patient-input' | 'medical-history' | 'lab-results' | 'vitals' | 'clinical-guidelines';
    description: string;
    accessedAt?: Date;
}

// ============================================
// Audit & Compliance
// ============================================

export interface AuditEntry {
    id: string;
    timestamp: Date;
    action: AuditAction;
    actorId: string; // Clinician ID
    actorRole: string;
    resourceType: string;
    resourceId: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
}

export type AuditAction =
    | 'view'
    | 'create'
    | 'update'
    | 'delete'
    | 'ai-analysis-requested'
    | 'ai-analysis-viewed'
    | 'recommendation-accepted'
    | 'recommendation-rejected'
    | 'report-generated'
    | 'consent-given'
    | 'consent-withdrawn';

// ============================================
// API Request/Response Types
// ============================================

export interface AnalysisRequest {
    encounterId: string;
    patientId: string;
    includeHistory: boolean;
    analysisDepth: 'quick' | 'standard' | 'comprehensive';
    specialtyFocus?: string[];
}

export interface AnalysisResponse {
    success: boolean;
    analysis?: DiagnosticAnalysis;
    error?: ApiError;
    processingTimeMs: number;
    requestId: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

// ============================================
// UI State Types
// ============================================

export interface PatientCaseState {
    patient: Patient | null;
    medicalHistory: MedicalHistory | null;
    currentEncounter: ClinicalEncounter | null;
    labPanels: LaboratoryPanel[];
    analysis: DiagnosticAnalysis | null;
    isLoading: boolean;
    error: string | null;
}

export interface NavigationState {
    currentStep: CaseWorkflowStep;
    completedSteps: CaseWorkflowStep[];
    canProceed: boolean;
}

export type CaseWorkflowStep =
    | 'patient-info'
    | 'medical-history'
    | 'symptoms'
    | 'vitals'
    | 'lab-results'
    | 'analysis'
    | 'recommendations';
