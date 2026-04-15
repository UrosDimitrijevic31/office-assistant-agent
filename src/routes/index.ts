import { FastifyInstance } from 'fastify';

import { agentRoutes } from './agent.routes';
import { approvalRoutes } from './approval.routes';
import { healthRoutes } from './health.routes';

export function registerRoutes(app: FastifyInstance) {
    app.register(healthRoutes, { prefix: '/health' });
    app.register(agentRoutes, { prefix: '/agent' });
    app.register(approvalRoutes, { prefix: '/approvals' });
}
