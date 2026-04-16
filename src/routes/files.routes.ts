import { FastifyInstance } from 'fastify';

import { handleFileUpload } from '../modules/files/file.controller';

export async function filesRoutes(app: FastifyInstance) {
    app.post('/upload', handleFileUpload);
}
