import Anthropic from '@anthropic-ai/sdk';
import { eq } from 'drizzle-orm';

import { db } from '@src/db/index.js';
import { sessions } from '@src/db/schema/index.js';

export async function getHistory(sessionId: string): Promise<Anthropic.MessageParam[]> {
    const row = await db.query.sessions.findFirst({
        where: eq(sessions.id, sessionId),
    });

    return row?.messages ?? [];
}

export async function appendToHistory(
    sessionId: string,
    messages: Anthropic.MessageParam[],
): Promise<void> {
    await db
        .insert(sessions)
        .values({ id: sessionId, messages })
        .onConflictDoUpdate({
            target: sessions.id,
            set: { messages, updatedAt: new Date() },
        });
}

export async function clearHistory(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}
