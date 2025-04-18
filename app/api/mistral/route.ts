import { NextResponse } from 'next/server';
import { createMistral } from '@ai-sdk/mistral';

const mistral = createMistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req: Request) {
    try {
        // Check if API key is available
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('MISTRAL_API_KEY is not configured');
        }

        const body = await req.json();

        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...body,
                model: 'mistral-small-latest',
                temperature: 0.7,
                top_p: 0.9,
                max_tokens: 1000,
                stream: false,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
                `Mistral API error: ${response.status} ${response.statusText}\n${JSON.stringify(errorData)}`
            );
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Mistral API Error:', error);
        return NextResponse.json(
            {
                message: 'Internal Server Error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
} 