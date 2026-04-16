import Anthropic from '@anthropic-ai/sdk';

const sessions = new Map<string, Anthropic.MessageParam[]>();

export function getHistory(sessionId: string): Anthropic.MessageParam[] {
    if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
    }
    return sessions.get(sessionId)!;
}

export function appendToHistory(sessionId: string, messages: Anthropic.MessageParam[]): void {
    sessions.set(sessionId, messages);
}

export function clearHistory(sessionId: string): void {
    sessions.delete(sessionId);
}
