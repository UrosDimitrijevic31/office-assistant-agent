import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';

export function registerPlugins(app: FastifyInstance) {
    app.register(multipart);
}
