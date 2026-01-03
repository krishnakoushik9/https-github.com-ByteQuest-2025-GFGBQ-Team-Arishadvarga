/**
 * CDSS - Symptom Extraction API Route
 * NLP-powered symptom extraction from free text
 */

import { NextRequest, NextResponse } from 'next/server';
import { extractSymptomsFromText } from '@/lib/gemini';
import type { Symptom } from '@/types/medical';

interface ExtractResponse {
    success: boolean;
    symptoms?: Symptom[];
    error?: {
        code: string;
        message: string;
    };
    processingTimeMs: number;
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const body = await request.json();
        const { text } = body as { text: string };

        if (!text || text.trim().length < 10) {
            return NextResponse.json<ExtractResponse>(
                {
                    success: false,
                    error: {
                        code: 'INVALID_INPUT',
                        message: 'Please provide a more detailed description of symptoms.',
                    },
                    processingTimeMs: Date.now() - startTime,
                },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json<ExtractResponse>(
                {
                    success: false,
                    error: {
                        code: 'CONFIGURATION_ERROR',
                        message: 'AI service is not properly configured.',
                    },
                    processingTimeMs: Date.now() - startTime,
                },
                { status: 500 }
            );
        }

        const symptoms = await extractSymptomsFromText(text, apiKey);

        return NextResponse.json<ExtractResponse>({
            success: true,
            symptoms,
            processingTimeMs: Date.now() - startTime,
        });

    } catch (error) {
        console.error('[ERROR] Symptom extraction failed:', error);

        return NextResponse.json<ExtractResponse>(
            {
                success: false,
                error: {
                    code: 'EXTRACTION_FAILED',
                    message: 'Failed to extract symptoms. Please try again.',
                },
                processingTimeMs: Date.now() - startTime,
            },
            { status: 500 }
        );
    }
}
