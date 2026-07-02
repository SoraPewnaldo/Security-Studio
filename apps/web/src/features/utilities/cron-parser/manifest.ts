import type { ToolManifest } from '@security-studio/types';

export const manifest: ToolManifest = {
  id: 'cron-parser',
  name: 'Cron Parser',
  description: 'Parse cron expressions and translate them into human-readable text',
  category: 'utilities',
  tags: ['cron', 'schedule', 'parser', 'time'],
  keywords: ['cron', 'crontab', 'schedule', 'parser', 'time'],
  version: '1.0.0',
  author: 'Security Studio',
  icon: 'Clock',
  shortcuts: [
    { label: 'Parse', keys: 'Ctrl+Enter', action: 'parse' },
  ],
  examples: [
    {
      label: 'Every minute',
      input: { cron: '* * * * *' },
      description: 'Standard cron for every minute'
    },
    {
      label: 'Every weekday at 5 PM',
      input: { cron: '0 17 * * 1-5' },
      description: 'Standard cron for 5 PM on weekdays'
    },
    {
      label: 'Complex expression',
      input: { cron: '*/5 9-17 * * 1-5' },
      description: 'Every 5 minutes, between 09:00 AM and 05:59 PM, Monday through Friday'
    }
  ]
};
