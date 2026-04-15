import { FastifyReply, FastifyRequest } from 'fastify';

import { processAgentMessage } from './agent.service';

type AgentQueryBody = {
    message: string;
};

export async function handleAgentQuery(
    request: FastifyRequest<{ Body: AgentQueryBody }>,
    reply: FastifyReply,
) {
    const result = await processAgentMessage(request.body.message);
    console.log(result, 'result');

    return reply.send(result);
}
