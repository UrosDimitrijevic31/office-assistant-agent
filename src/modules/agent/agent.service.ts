import { randomUUID } from 'node:crypto';

import { createApproval } from '../approvals/approval.store';

export type AgentIntent = 'schedule_meeting' | 'send_email' | 'create_ticket' | 'unknown';

export type AgentResponse = {
    status: 'success' | 'needs_approval' | 'error';
    intent: AgentIntent;
    message: string;
    data?: Record<string, unknown>;
};

export async function processAgentMessage(message: string): Promise<AgentResponse> {
    const text = message.toLowerCase();

    if (text.includes('meeting') || text.includes('schedule')) {
        const approval = createApproval({
            id: randomUUID(),
            type: 'schedule_meeting',
            status: 'pending',
            payload: {
                title: 'Office meeting',
                participants: ['ana@company.com'],
                start: '2026-04-15T15:00:00+02:00',
                end: '2026-04-15T15:30:00+02:00',
            },
        });

        return {
            status: 'needs_approval',
            intent: 'schedule_meeting',
            message: 'Meeting prepared and waiting for approval.',
            data: {
                approvalId: approval.id,
                preview: approval.payload,
            },
        };
    }

    if (text.includes('email') || text.includes('mail') || text.includes('send')) {
        const approval = createApproval({
            id: randomUUID(),
            type: 'send_email',
            status: 'pending',
            payload: {
                to: ['ana@company.com'],
                subject: 'Office update',
                body: 'Hello, this is a prepared office update email.',
            },
        });

        return {
            status: 'needs_approval',
            intent: 'send_email',
            message: 'Email prepared and waiting for approval.',
            data: {
                approvalId: approval.id,
                preview: approval.payload,
            },
        };
    }

    if (text.includes('ticket') || text.includes('issue') || text.includes('bug')) {
        const approval = createApproval({
            id: randomUUID(),
            type: 'create_ticket',
            status: 'pending',
            payload: {
                title: 'Laptop issue',
                description: 'The employee laptop is not starting.',
                priority: 'medium',
            },
        });

        return {
            status: 'needs_approval',
            intent: 'create_ticket',
            message: 'Ticket prepared and waiting for approval.',
            data: {
                approvalId: approval.id,
                preview: approval.payload,
            },
        };
    }

    return {
        status: 'success',
        intent: 'unknown',
        message: 'No action matched.',
    };
}
