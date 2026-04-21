import 'dotenv/config';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

const run = async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    const db = drizzle(pool);

    console.log('Running migrations...');

    await migrate(db, { migrationsFolder: './src/db/migrations' });

    console.log('Migrations applied successfully.');

    await pool.end();
};

run().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
