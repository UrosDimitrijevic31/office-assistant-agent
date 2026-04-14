type PendingApproval = {
    id: string;
    type: 'schedule_meeting' | 'send_email' | 'create_ticket';
    payload: Record<string, unknown>;
    status: 'pending' | 'approved';
};

const approvals = new Map<string, PendingApproval>();

export function createApproval(input: PendingApproval) {
    approvals.set(input.id, input);
    return input;
}

export function getApproval(id: string) {
    return approvals.get(id);
}

export function approve(id: string) {
    const current = approvals.get(id);
    if (!current) return null;

    const updated = { ...current, status: 'approved' as const };
    approvals.set(id, updated);
    return updated;
}
