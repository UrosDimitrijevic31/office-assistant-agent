import 'dotenv/config';

import Fastify from 'fastify';

import { registerPlugins } from './plugins';
import { registerRoutes } from './routes';

export const buildApp = () => {
    const app = Fastify({
        logger: true,
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
