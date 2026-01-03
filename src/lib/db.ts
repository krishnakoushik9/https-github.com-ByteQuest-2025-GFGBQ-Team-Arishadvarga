import { db } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type {
    DiagnosticAnalysis,
    Patient,
    ClinicalEncounter,
    MedicalHistory,
    LaboratoryPanel
} from '@/types/medical';

export interface SavedCase {
    patient: Patient;
    encounter: ClinicalEncounter;
    history: MedicalHistory | null;
    labResults: LaboratoryPanel[];
    analysis: DiagnosticAnalysis;
    savedAt: any; // Firestore Timestamp
}

/**
 * Save a complete clinical case to Firestore
 */
export async function saveClinicalCase(
    patient: Patient,
    encounter: ClinicalEncounter,
    history: MedicalHistory | null,
    labResults: LaboratoryPanel[],
    analysis: DiagnosticAnalysis
) {
    try {
        const caseData = {
            patient,
            encounter,
            history: history || null,
            labResults: labResults.map(panel => ({
                ...panel,
                // Ensure no undefined values which Firestore hates
                results: panel.results.map(r => ({
                    ...r,
                    referenceRange: r.referenceRange ? { ...r.referenceRange } : null
                }))
            })),
            analysis,
            savedAt: Timestamp.now(),
            // Add search fields
            searchTerms: [
                patient.pseudonymizedId,
                encounter.chiefComplaint.toLowerCase(),
                ...analysis.differentialDiagnoses.map(d => d.condition.toLowerCase())
            ]
        };

        const docRef = await addDoc(collection(db, 'cases'), caseData);
        return docRef.id;
    } catch (error) {
        console.error('Error saving case to Firestore:', error);
        throw new Error('Failed to save case');
    }
}

/**
 * Fetch recent clinical cases from Firestore
 */
export async function getRecentCases(limitCount: number = 10): Promise<(SavedCase & { id: string })[]> {
    try {
        const { getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const casesRef = collection(db, 'cases');
        const q = query(casesRef, orderBy('savedAt', 'desc'), limit(limitCount));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as SavedCase
        }));
    } catch (error) {
        console.error('Error fetching cases from Firestore:', error);
        return [];
    }
}

/**
 * Fetch all clinical cases from Firestore
 */
export async function getAllCases(): Promise<(SavedCase & { id: string })[]> {
    try {
        const { getDocs, query, orderBy } = await import('firebase/firestore');
        const casesRef = collection(db, 'cases');
        const q = query(casesRef, orderBy('savedAt', 'desc'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as SavedCase
        }));
    } catch (error) {
        console.error('Error fetching all cases from Firestore:', error);
        return [];
    }
}

/**
 * Get a single case by ID
 */
export async function getCaseById(caseId: string): Promise<(SavedCase & { id: string }) | null> {
    try {
        const { doc, getDoc } = await import('firebase/firestore');
        const caseRef = doc(db, 'cases', caseId);
        const caseSnap = await getDoc(caseRef);

        if (caseSnap.exists()) {
            return {
                id: caseSnap.id,
                ...caseSnap.data() as SavedCase
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching case:', error);
        return null;
    }
}
