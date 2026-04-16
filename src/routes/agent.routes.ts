import { FastifyInstance } from 'fastify';

import { handleAgentQuery } from '../modules/agent/agent.controller';

export async function agentRoutes(app: FastifyInstance) {
    app.post(
        '/query',
        {
            schema: {
                body: {
                    type: 'object',
                    required: ['message', 'sessionId'],
                    properties: {
                        message: { type: 'string', minLength: 1 },
                        sessionId: { type: 'string', minLength: 1 },
                    },
                },
            },
        },
        handleAgentQuery,
    );
}
