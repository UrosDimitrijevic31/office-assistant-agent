import { eq } from 'drizzle-orm';

import { db } from '@src/db/index.js';
import { Approval, NewApproval, approvals } from '@src/db/schema/index.js';

export async function createApproval(input: NewApproval): Promise<Approval> {
    const [row] = await db.insert(approvals).values(input).returning();
    return row;
}

export async function getApproval(id: string): Promise<Approval | null> {
    const row = await db.query.approvals.findFirst({
        where: eq(approvals.id, id),
    });

    return row ?? null;
}

export async function approve(id: string): Promise<Approval | null> {
    const [row] = await db
        .update(approvals)
        .set({ status: 'approved', updatedAt: new Date() })
        .where(eq(approvals.id, id))
        .returning();

    return row ?? null;
}
