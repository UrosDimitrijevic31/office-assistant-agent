import { FastifyReply, FastifyRequest } from 'fastify';

import { processAgentMessage } from './agent.service';

type AgentQueryBody = {
    message: string;
};

export async function handleAgentQuery(request: FastifyRequest, reply: FastifyReply) {
    const { message } = request.body as AgentQueryBody;
    const result = await processAgentMessage(message, request.user.id);
    return reply.send(result);
}
