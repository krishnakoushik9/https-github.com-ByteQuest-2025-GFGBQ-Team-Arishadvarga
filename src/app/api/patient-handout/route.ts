import { NextRequest, NextResponse } from 'next/server';
import { generatePatientExplanation } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { diagnosis, patientAge } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
        }

        const explanation = await generatePatientExplanation(diagnosis, patientAge, apiKey);

        return NextResponse.json({ explanation });
    } catch (error) {
        console.error('Explanation generation error:', error);
        return NextResponse.json({ error: 'Generation Failed' }, { status: 500 });
    }
}
