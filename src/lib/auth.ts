import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@src/db/index.js';
import { accounts, authSessions, users, verifications } from '@src/db/schema/index.js';

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET!,
    baseURL: process.env.BETTER_AUTH_URL!,
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user: users,
            session: authSessions,
            account: accounts,
            verification: verifications,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    session: {
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24, // rotate session if older than 1 day
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // cache in cookie for 5 min to reduce DB hits
        },
    },
});

export type Auth = typeof auth;
export type Session = typeof auth.$Infer.Session;
