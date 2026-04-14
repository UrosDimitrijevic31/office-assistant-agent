export async function scheduleMeetingTool(input: {
  title: string;
  participants: string[];
  start: string;
  end: string;
}) {
  return {
    eventId: 'evt_123',
    status: 'created',
    ...input,
  };
}
