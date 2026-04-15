export async function createTicketTool(input: {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}) {
    return {
        ticketId: 'tic_123',
        status: 'created',
        ...input,
    };
}
