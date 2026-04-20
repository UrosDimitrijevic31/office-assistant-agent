import Anthropic from '@anthropic-ai/sdk';
import { jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const sessions = pgTable('sessions', {
    id: text('id').primaryKey(),
    messages: jsonb('messages').notNull().$type<Anthropic.MessageParam[]>().default([]),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
