export async function sendEmailTool(input: { to: string[]; subject: string; body: string }) {
    return {
        messageId: 'msg_123',
        status: 'sent',
        ...input,
    };
}
