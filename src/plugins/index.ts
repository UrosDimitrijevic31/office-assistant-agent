import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

import { registerAuthPlugin } from './auth.plugin.js';

const ALLOWED_ORIGINS = process.env.BETTER_AUTH_URL;

export function registerPlugins(app: FastifyInstance) {
    app.register(cors, {
        origin: ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    });

    app.register(rateLimit, {
        global: false, // only apply where explicitly set
    });

    app.register(multipart);
    app.register(registerAuthPlugin);
}
