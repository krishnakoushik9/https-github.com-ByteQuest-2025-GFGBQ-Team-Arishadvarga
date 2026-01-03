/**
 * CDSS - Clinical Analysis API Route
 * Server-side endpoint for Gemini AI analysis
 */

import { NextRequest, NextResponse } from 'next/server';
import { performClinicalAnalysis, MEDICAL_DISCLAIMER } from '@/lib/gemini';
import type {
    Patient,
    ClinicalEncounter,
    MedicalHistory,
    LaboratoryPanel,
    AnalysisResponse
} from '@/types/medical';

// Rate limiting store (in-memory for demo, use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

function checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const clientLimit = rateLimitStore.get(clientId);

    if (!clientLimit || now > clientLimit.resetTime) {
        rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
        return true;
    }

    if (clientLimit.count >= RATE_LIMIT) {
        return false;
    }

    clientLimit.count++;
    return true;
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        // Get client identifier for rate limiting
        const clientId = request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'anonymous';

        // Check rate limit
        if (!checkRateLimit(clientId)) {
            return NextResponse.json<AnalysisResponse>(
                {
                    success: false,
                    error: {
                        code: 'RATE_LIMIT_EXCEEDED',
                        message: 'Too many requests. Please wait before trying again.',
                    },
                    processingTimeMs: Date.now() - startTime,
                    requestId,
                },
                { status: 429 }
            );
        }

        // Parse request body
        const body = await request.json();
        console.log('[API] analyze request body keys:', Object.keys(body));

        const { patient, encounter, history, labResults } = body as {
            patient: Patient;
            encounter: ClinicalEncounter;
            history: MedicalHistory | null;
            labResults: LaboratoryPanel[];
        };

        console.log('[API] Received patient:', JSON.stringify(patient, null, 2));
        console.log('[API] Received encounter:', JSON.stringify(encounter, null, 2));

        // Validate required fields
        if (!patient || !encounter) {
            return NextResponse.json<AnalysisResponse>(
                {
                    success: false,
                    error: {
                        code: 'INVALID_REQUEST',
                        message: 'Patient and encounter data are required.',
                    },
                    processingTimeMs: Date.now() - startTime,
                    requestId,
                },
                { status: 400 }
            );
        }

        // Check consent
        if (!patient.consentGiven) {
            return NextResponse.json<AnalysisResponse>(
                {
                    success: false,
                    error: {
                        code: 'CONSENT_REQUIRED',
                        message: 'Patient consent is required for AI analysis.',
                    },
                    processingTimeMs: Date.now() - startTime,
                    requestId,
                },
                { status: 403 }
            );
        }

        // Get API key from environment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not configured');
            return NextResponse.json<AnalysisResponse>(
                {
                    success: false,
                    error: {
                        code: 'CONFIGURATION_ERROR',
                        message: 'AI service is not properly configured.',
                    },
                    processingTimeMs: Date.now() - startTime,
                    requestId,
                },
                { status: 500 }
            );
        }

        // Perform analysis
        const analysis = await performClinicalAnalysis(
            patient,
            encounter,
            history,
            labResults || [],
            apiKey
        );

        // Log audit entry (in production, store to database)
        console.log('[AUDIT]', {
            requestId,
            action: 'clinical-analysis',
            patientId: patient.pseudonymizedId,
            encounterId: encounter.id,
            timestamp: new Date().toISOString(),
            processingTimeMs: Date.now() - startTime,
        });

        return NextResponse.json<AnalysisResponse>({
            success: true,
            analysis,
            processingTimeMs: Date.now() - startTime,
            requestId,
        });

    } catch (error) {
        console.error('[ERROR] Analysis failed:', error);

        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

        return NextResponse.json<AnalysisResponse>(
            {
                success: false,
                error: {
                    code: 'ANALYSIS_FAILED',
                    message: 'Failed to complete clinical analysis. Please try again.',
                    details: { originalError: errorMessage },
                },
                processingTimeMs: Date.now() - startTime,
                requestId,
            },
            { status: 500 }
        );
    }
}

// OPTIONS handler for CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}
