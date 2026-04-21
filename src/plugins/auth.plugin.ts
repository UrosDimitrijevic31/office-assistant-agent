import { FastifyInstance } from 'fastify';

import { auth } from '@src/lib/auth.js';

export async function registerAuthPlugin(app: FastifyInstance) {
    app.decorate('authenticate', async function (request: any, reply: any) {
        const session = await auth.api.getSession({
            headers: request.headers as Headers,
        });

        if (!session) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }

        request.user = session.user;
        request.session = session.session;
    });
}
