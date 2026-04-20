import { jsonb, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const toolTypeEnum = pgEnum('tool_type', [
    'get_current_datetime',
    'schedule_meeting',
    'send_email',
    'create_ticket',
]);

export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved']);

export const approvals = pgTable('approvals', {
    id: text('id').primaryKey(),
    type: toolTypeEnum('type').notNull(),
    payload: jsonb('payload').notNull().$type<Record<string, unknown>>(),
    status: approvalStatusEnum('status').notNull().default('pending'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Approval = typeof approvals.$inferSelect;
export type NewApproval = typeof approvals.$inferInsert;
