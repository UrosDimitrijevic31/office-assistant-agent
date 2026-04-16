import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export type UploadedFile = {
    fileId: string;
    filename: string;
    uploadedAt: string;
};

// In-memory registry — swap for DB in production
const fileRegistry = new Map<string, UploadedFile>();

export async function uploadPdfToAnthropic(
    buffer: Buffer,
    filename: string,
): Promise<UploadedFile> {
    const file = new File([new Uint8Array(buffer)], filename, { type: 'application/pdf' });

    const response = await client.beta.files.upload({ file });

    const record: UploadedFile = {
        fileId: response.id,
        filename,
        uploadedAt: new Date().toISOString(),
    };

    fileRegistry.set(response.id, record);
    return record;
}

export function getFileRecord(fileId: string): UploadedFile | undefined {
    return fileRegistry.get(fileId);
}

export async function readPdfWithClaude(fileId: string, question: string): Promise<string> {
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
                            type: 'file',
                            file_id: fileId,
                        } as unknown as { type: 'base64'; media_type: 'application/pdf'; data: string },
                    },
                    {
                        type: 'text',
                        text: question,
                    },
                ],
            },
        ],
    });

    const textBlock = response.content.find(
        (block): block is Anthropic.TextBlock => block.type === 'text',
    );

    return textBlock?.text ?? 'Could not extract content from PDF.';
}
