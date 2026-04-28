import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

import { registerAuthPlugin } from './auth.plugin.js';
import { registerLoggerPlugin } from './logger.plugin.js';

const ALLOWED_ORIGINS = process.env.FRONTEND_URL;

export function registerPlugins(app: FastifyInstance) {
    app.register(cors, {
        origin: ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    app.register(rateLimit, {
        global: false,
    });

    app.register(multipart);
    app.register(registerAuthPlugin);
    app.register(registerLoggerPlugin);
}
