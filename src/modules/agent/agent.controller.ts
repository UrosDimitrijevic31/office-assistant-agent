import { FastifyReply, FastifyRequest } from 'fastify';

import { processAgentMessage } from './agent.service';

type AgentQueryBody = {
    message: string;
    sessionId: string;
};

export async function handleAgentQuery(
    request: FastifyRequest<{ Body: AgentQueryBody }>,
    reply: FastifyReply,
) {
    const { message, sessionId } = request.body;
    const result = await processAgentMessage(message, sessionId);
    return reply.send(result);
}
