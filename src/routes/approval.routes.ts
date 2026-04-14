import { FastifyInstance } from 'fastify';

import { approve, getApproval } from '@src/modules/approvals/approval.store';
import { scheduleMeetingTool } from '@src/modules/tools/calendar.tool';
import { sendEmailTool } from '@src/modules/tools/email.tool';
import { createTicketTool } from '@src/modules/tools/ticket.tool';

export async function approvalRoutes(app: FastifyInstance) {
    app.post('/:approvalId/approve', async (request, reply) => {
        const { approvalId } = request.params as { approvalId: string };

        const pending = getApproval(approvalId);

        if (!pending) {
            return reply.code(404).send({
                message: 'Approval not found',
            });
        }
        const updated = approve(approvalId);

        let result: unknown = null;

        if (pending.type === 'schedule_meeting') {
            result = await scheduleMeetingTool(
                pending.payload as {
                    title: string;
                    participants: string[];
                    start: string;
                    end: string;
                },
            );
        }

        if (pending.type === 'send_email') {
            result = await sendEmailTool(
                pending.payload as {
                    to: string[];
                    subject: string;
                    body: string;
                },
            );
        }

        if (pending.type === 'create_ticket') {
            result = await createTicketTool(
                pending.payload as {
                    title: string;
                    description: string;
                    priority: 'low' | 'medium' | 'high';
                },
            );
        }

        return {
            status: 'approved',
            approval: updated,
            result,
        };
    });
}
