import { FastifyInstance } from 'fastify';

import { agentRoutes } from './agent.routes';
import { approvalRoutes } from './approval.routes';
import { authRoutes } from './auth.routes';
import { filesRoutes } from './files.routes';
import { healthRoutes } from './health.routes';

export function registerRoutes(app: FastifyInstance) {
    app.register(healthRoutes, { prefix: '/health' });
    app.register(authRoutes, { prefix: '/api/auth' });
    app.register(agentRoutes, { prefix: '/agent' });
    app.register(approvalRoutes, { prefix: '/approvals' });
    app.register(filesRoutes, { prefix: '/files' });
}
