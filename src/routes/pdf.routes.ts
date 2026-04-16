import { FastifyInstance } from 'fastify';

import { handlePdfAnalyze } from '../modules/pdf/pdf.controller';

export async function pdfRoutes(app: FastifyInstance) {
    app.post('/analyze', handlePdfAnalyze);
}
