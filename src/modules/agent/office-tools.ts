// src/modules/tools/office-tools.ts
import Anthropic from '@anthropic-ai/sdk';

export const officeTools: Anthropic.Tool[] = [
    {
        name: 'get_current_datetime',
        description:
            'Returns the current date and time. Always use this tool first when the user refers to relative times like "in 2 hours", "tomorrow", "next Monday", "next month", "this afternoon", or any time relative to now.',
        input_schema: {
            type: 'object',
            properties: {},
            required: [],
            additionalProperties: false,
        },
    },
    {
        name: 'schedule_meeting',
        description:
            'Schedule a meeting with one or more participants. Use this when the user wants to create, book, arrange, or schedule a meeting or calendar event.',
        input_schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Short meeting title',
                },
                participants: {
                    type: 'array',
                    description: 'List of participant identifiers, emails, or names',
                    items: {
                        type: 'string',
                    },
                    minItems: 1,
                },
                start: {
                    type: 'string',
                    description: 'Meeting start datetime, preferably ISO 8601',
                },
                end: {
                    type: 'string',
                    description: 'Meeting end datetime, preferably ISO 8601',
                },
                location: {
                    type: 'string',
                    description: 'Optional meeting location or call link',
                },
                description: {
                    type: 'string',
                    description: 'Optional meeting description or agenda',
                },
            },
            required: ['title', 'participants', 'start', 'end'],
            additionalProperties: false,
        },
    },
    {
        name: 'send_email',
        description:
            'Send an email to one or more recipients. Use this when the user wants to send, draft, or notify someone by email.',
        input_schema: {
            type: 'object',
            properties: {
                to: {
                    type: 'array',
                    description: 'Primary recipients',
                    items: {
                        type: 'string',
                    },
                    minItems: 1,
                },
                cc: {
                    type: 'array',
                    description: 'Optional CC recipients',
                    items: {
                        type: 'string',
                    },
                },
                subject: {
                    type: 'string',
                    description: 'Email subject line',
                },
                body: {
                    type: 'string',
                    description: 'Email body content',
                },
            },
            required: ['to', 'subject', 'body'],
            additionalProperties: false,
        },
    },
    {
        name: 'create_ticket',
        description:
            'Create a support or operations ticket. Use this when the user reports a problem, requests support, or wants an issue tracked.',
        input_schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    description: 'Short ticket title',
                },
                description: {
                    type: 'string',
                    description: 'Detailed description of the issue or request',
                },
                priority: {
                    type: 'string',
                    description: 'Ticket priority',
                    enum: ['low', 'medium', 'high'],
                },
                category: {
                    type: 'string',
                    description: 'Optional ticket category such as IT, office, HR, access',
                },
            },
            required: ['title', 'description', 'priority'],
            additionalProperties: false,
        },
    },
];
