import { Session } from '@src/lib/auth.js';

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }

    interface FastifyRequest {
        user: Session['user'];
        session: Session['session'];
    }
}
