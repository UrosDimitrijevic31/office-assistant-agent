import { FastifyReply, FastifyRequest } from 'fastify';

import { uploadPdfToAnthropic } from './file.service';

const MAX_FILE_SIZE = 32 * 1024 * 1024; // 32MB — Anthropic Files API limit

export async function handleFileUpload(request: FastifyRequest, reply: FastifyReply) {
    const data = await request.file({ limits: { fileSize: MAX_FILE_SIZE } });

    if (!data) {
        return reply.code(400).send({ status: 'error', message: 'No file uploaded.' });
    }

    if (data.mimetype !== 'application/pdf') {
        return reply.code(400).send({ status: 'error', message: 'Only PDF files are supported.' });
    }

    const buffer = await data.toBuffer();

    if (buffer.length === 0) {
        return reply.code(400).send({ status: 'error', message: 'Uploaded file is empty.' });
    }

    const record = await uploadPdfToAnthropic(buffer, data.filename);

    return reply.code(201).send({
        status: 'success',
        fileId: record.fileId,
        filename: record.filename,
        uploadedAt: record.uploadedAt,
    });
}
