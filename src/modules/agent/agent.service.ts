import { randomUUID } from 'node:crypto';

import Anthropic from '@anthropic-ai/sdk';

import { createApproval } from '../approvals/approval.store';
import { getCurrentDatetimeTool } from '../tools/datetime.tool';
import { readPdfWithClaude } from '../files/file.service';
import { callClaude } from './claude.service';
import { appendToHistory, getHistory } from './session.store';

export type AgentIntent = 'schedule_meeting' | 'send_email' | 'create_ticket' | 'unknown';

type ApprovalIntent = 'schedule_meeting' | 'send_email' | 'create_ticket';

const APPROVAL_INTENTS: ApprovalIntent[] = ['schedule_meeting', 'send_email', 'create_ticket'];

function isApprovalIntent(value: string): value is ApprovalIntent {
    return APPROVAL_INTENTS.includes(value as ApprovalIntent);
}

export type AgentResponse = {
    status: 'success' | 'needs_approval' | 'error';
    intent: AgentIntent;
    message: string;
    data?: Record<string, unknown>;
};

export async function processAgentMessage(
    message: string,
    sessionId: string,
): Promise<AgentResponse> {
    try {
        const messages = getHistory(sessionId);
        messages.push({ role: 'user', content: message });

        let { response } = await callClaude(messages);

        while (response.stop_reason === 'tool_use') {
            const toolBlock = response.content.find(
                (block): block is Anthropic.ToolUseBlock => block.type === 'tool_use',
            );

            if (!toolBlock) {
                return { status: 'error', intent: 'unknown', message: 'Tool block missing.' };
            }

            // Action tools — stop loop and wait for user approval
            if (isApprovalIntent(toolBlock.name)) {
                const intent = toolBlock.name;
                const payload = toolBlock.input as Record<string, unknown>;

                const approval = createApproval({
                    id: randomUUID(),
                    type: intent,
                    status: 'pending',
                    payload,
                });

                return {
                    status: 'needs_approval',
                    intent,
                    message: `${formatIntentLabel(intent)} prepared and waiting for approval.`,
                    data: {
                        approvalId: approval.id,
                        preview: approval.payload,
                    },
                };
            }

            // Transparent tools — execute immediately and continue loop
            let toolResult: unknown;

            if (toolBlock.name === 'get_current_datetime') {
                toolResult = getCurrentDatetimeTool();
            } else if (toolBlock.name === 'read_pdf') {
                const { fileId, question } = toolBlock.input as { fileId: string; question: string };
                const content = await readPdfWithClaude(fileId, question);
                toolResult = { content };
            } else {
                toolResult = { error: `Unknown tool: ${toolBlock.name}` };
            }

            // Append assistant response and tool result, then call Claude again
            messages.push({ role: 'assistant', content: response.content });
            messages.push({
                role: 'user',
                content: [
                    {
                        type: 'tool_result',
                        tool_use_id: toolBlock.id,
                        content: JSON.stringify(toolResult),
                    },
                ],
            });

            ({ response } = await callClaude(messages));
        }

        // Claude responded with plain text — no tool needed
        const textBlock = response.content.find(
            (block): block is Anthropic.TextBlock => block.type === 'text',
        );
        const replyText = textBlock
            ? textBlock.text.replace(/\n+/g, ' ').trim()
            : 'No response from assistant.';

        messages.push({ role: 'assistant', content: response.content });
        appendToHistory(sessionId, messages);

        return {
            status: 'success',
            intent: 'unknown',
            message: replyText,
        };
    } catch (error) {
        return {
            status: 'error',
            intent: 'unknown',
            message: 'Failed to process the request.',
            data: {
                error: error instanceof Error ? error.message : 'Unknown error',
            },
        };
    }
}

function formatIntentLabel(intent: ApprovalIntent): string {
    switch (intent) {
        case 'schedule_meeting':
            return 'Meeting';
        case 'send_email':
            return 'Email';
        case 'create_ticket':
            return 'Ticket';
    }
}
