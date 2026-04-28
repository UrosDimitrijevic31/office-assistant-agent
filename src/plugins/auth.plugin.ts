import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { auth } from '@src/lib/auth.js';

async function authPlugin(app: FastifyInstance) {
    app.decorate('authenticate', async function (request: any, reply: any) {
        const session = await auth.api.getSession({
            headers: request.headers as unknown as Headers,
        });

        if (!session) {
            return reply.status(401).send({ message: 'Unauthorized' });
        }

        request.user = session.user;
        request.session = session.session;
    });
}

export const registerAuthPlugin = fp(authPlugin);
