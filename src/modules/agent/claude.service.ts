import Anthropic from '@anthropic-ai/sdk';
import * as dotenv from 'dotenv';

import { officeTools } from './office-tools';

dotenv.config(); // must be before new Anthropic()

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const systemPrompt = `You are a professional office assistant.

    You have access to tools for scheduling meetings, sending emails, and creating tickets.

    Rules:
    - When the user wants to schedule a meeting, send an email, or create a ticket — use the appropriate tool.
    - Extract all required parameters from the user message. If something is missing, ask for it before calling the tool.
    - If no tool is needed, respond normally.
    - Do not claim an action was completed unless you receive a tool_result confirming success.
    - Always respond in the language the user is writing in.
    - Keep responses short, clear, and professional. No markdown, no bullet points, no line breaks.`;

export type ClaudeCallResult = {
    response: Anthropic.Message;
    messages: Anthropic.MessageParam[];
};

export async function callClaude(
    messages: Anthropic.MessageParam[],
): Promise<ClaudeCallResult> {
    try {
        const response = (await client.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            system: systemPrompt,
            tools: officeTools,
            messages,
        })) as Anthropic.Message;

        return { response, messages };
    } catch (err) {
        console.error('Claude API Error:', err);
        throw err;
    }
}
