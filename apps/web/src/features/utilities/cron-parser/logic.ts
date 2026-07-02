import cronstrue from 'cronstrue';

export function parseCron(cron: string): string {
  if (!cron.trim()) return '';
  try {
    return cronstrue.toString(cron, { use24HourTimeFormat: true });
  } catch (e: any) {
    throw new Error(e.toString());
  }
}
