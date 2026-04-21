import { FastifyInstance } from 'fastify';

import { auth } from '@src/lib/auth.js';

export async function authRoutes(app: FastifyInstance) {
    app.route({
        method: ['GET', 'POST'],
        url: '/*',
        config: {
            rateLimit: {
                max: 10,
                timeWindow: '1 minute',
            },
        },
        handler: async (request, reply) => {
            const response = await auth.handler(
                new Request(new URL(request.url, process.env.BETTER_AUTH_URL), {
                    method: request.method,
                    headers: request.headers as HeadersInit,
                    body:
                        request.method !== 'GET' && request.method !== 'HEAD'
                            ? JSON.stringify(request.body)
                            : undefined,
                }),
            );

            reply.status(response.status);

            response.headers.forEach((value, key) => {
                reply.header(key, value);
            });

            const body = await response.text();
            return reply.send(body);
        },
    });
}
//   ------------------------------------------------------
//   │           Endpoint           │       Purpose       │
//   ├──────────────────────────────┼─────────────────────┤
//   │ POST /api/auth/sign-up/email │ Register            │
//   ├──────────────────────────────┼─────────────────────┤
//   │ POST /api/auth/sign-in/email │ Login               │
//   ├──────────────────────────────┼─────────────────────┤
//   │ POST /api/auth/sign-out      │ Logout              │
//   ├──────────────────────────────┼─────────────────────┤
//   │ GET /api/auth/session        │ Get current session │
//   └──────────────────────────────┴─────────────────────┘
