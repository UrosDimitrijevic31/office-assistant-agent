import 'dotenv/config';
import Fastify from 'fastify';

import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

const isDev = process.env.NODE_ENV !== 'production';

export const buildApp = () => {
    const app = Fastify({
        logger: {
            level: process.env.LOG_LEVEL ?? 'info',
            redact: ['req.headers.authorization', 'req.headers.cookie'],
            transport: isDev
                ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:standard' } }
                : undefined,
        },
    });

    registerPlugins(app);
    registerRoutes(app);

    return app;
};

const start = async () => {
    const app = buildApp();

    try {
        await app.listen({ port: 4009, host: '0.0.0.0' });
        app.log.info('Server running on http://localhost:4009');
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

start();
