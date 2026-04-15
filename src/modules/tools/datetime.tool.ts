export function getCurrentDatetimeTool(): { datetime: string; timezone: string } {
    return {
        datetime: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
}
