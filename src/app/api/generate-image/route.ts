import { NextRequest, NextResponse } from 'next/server';
import { generateMedicalImage } from '@/lib/gemini';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, context } = body;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
        }

        const imageBase64 = await generateMedicalImage(type, context, apiKey);

        return NextResponse.json({ image: imageBase64 });
    } catch (error) {
        console.error('Image generation error:', error);
        return NextResponse.json({ error: 'Generation Failed' }, { status: 500 });
    }
}
