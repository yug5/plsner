import { NextResponse } from 'next/server';
import { createMistral } from '@ai-sdk/mistral';

const mistral = createMistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(`Mistral API error: ${response.statusText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Mistral API Error:', error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
} 