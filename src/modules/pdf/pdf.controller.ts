import { FastifyReply, FastifyRequest } from 'fastify';

import { analyzePdf } from './pdf.service';

export async function handlePdfAnalyze(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file();

    if (!data) {
        return reply.code(400).send({ status: 'error', message: 'No file uploaded.' });
    }

    if (data.mimetype !== 'application/pdf') {
        return reply.code(400).send({ status: 'error', message: 'Only PDF files are supported.' });
    }

    const prompt = (data.fields['prompt'] as { value: string } | undefined)?.value ?? 'Summarize this document.';

    const fileBuffer = await data.toBuffer();
    const result = await analyzePdf(fileBuffer, prompt);

    return reply.send(result);
}
