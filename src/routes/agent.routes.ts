import { FastifyInstance } from 'fastify';

import { handleAgentQuery } from '../modules/agent/agent.controller';

export async function agentRoutes(app: FastifyInstance) {
    app.post(
        '/query',
        {
            preHandler: app.authenticate,
            schema: {
                body: {
                    type: 'object',
                    required: ['message'],
                    properties: {
                        message: { type: 'string', minLength: 1 },
                    },
                },
            },
        },
        handleAgentQuery,
    );
}
