import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type PdfResponse = {
    status: 'success' | 'error';
    message: string;
};

export async function analyzePdf(fileBuffer: Buffer, prompt: string): Promise<PdfResponse> {
    try {
        const base64Pdf = fileBuffer.toString('base64');

        const response = await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 2048,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'document',
                            source: {
                                type: 'base64',
                                media_type: 'application/pdf',
                                data: base64Pdf,
                            },
                        },
                        {
                            type: 'text',
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const textBlock = response.content.find(
            (block): block is Anthropic.TextBlock => block.type === 'text',
        );

        return {
            status: 'success',
            message: textBlock ? textBlock.text : 'No response from assistant.',
        };
    } catch (err) {
        console.error('PDF Agent Error:', err);
        return {
            status: 'error',
            message: err instanceof Error ? err.message : 'Failed to analyze PDF.',
        };
    }
}
