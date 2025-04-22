import { NextResponse } from 'next/server';
import { createMistral } from '@ai-sdk/mistral';
import PDFDocument from 'pdfkit';

const mistral = createMistral({
    apiKey: process.env.MISTRAL_API_KEY,
});

export async function POST(req: Request) {
    try {
        // Check if API key is available
        if (!process.env.MISTRAL_API_KEY) {
            console.error('MISTRAL_API_KEY is not configured');
            return NextResponse.json(
                { error: 'API key not configured' },
                { status: 500 }
            );
        }

        const body = await req.json();
        console.log('Request body:', body);

        // Get the base URL for the API
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

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
                max_tokens: 4000,
                stream: false,
            }),
        });

        console.log('Mistral API Response Status:', response.status);

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            console.error('Mistral API Error:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            return NextResponse.json(
                {
                    error: 'Mistral API error',
                    status: response.status,
                    message: response.statusText,
                    details: errorData
                },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('Mistral API Success Response:', data);

        // If PDF format is requested, generate PDF
        if (body.format === 'pdf') {
            const doc = new PDFDocument();
            const chunks: Uint8Array[] = [];

            doc.on('data', (chunk) => chunks.push(chunk));

            // Add content to PDF
            doc.fontSize(12);
            doc.text(data.choices[0].message.content);

            // Finalize PDF
            doc.end();

            // Wait for all chunks to be collected
            await new Promise((resolve) => {
                doc.on('end', resolve);
            });

            // Combine chunks into a single buffer
            const pdfBuffer = Buffer.concat(chunks);

            // Return PDF as a downloadable file
            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="response.pdf"',
                },
            });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('Mistral API Error:', error);
        return NextResponse.json(
            {
                error: 'Internal Server Error',
                message: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            },
            { status: 500 }
        );
    }
} 