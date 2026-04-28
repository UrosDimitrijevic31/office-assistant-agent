import { FastifyInstance } from 'fastify';

import { auth } from '@src/lib/auth.js';

export async function registerLoggerPlugin(app: FastifyInstance) {
    app.addHook('onResponse', async (request, reply) => {
        const session = await auth.api
            .getSession({ headers: request.headers as unknown as Headers })
            .catch(() => null);

        request.log.info({
            audit: true,
            method: request.method,
            url: request.url,
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
            userId: session?.user?.id ?? 'anonymous',
            userEmail: session?.user?.email ?? null,
            ip: request.ip,
        });
    });
}
