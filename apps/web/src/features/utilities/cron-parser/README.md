# Cron Parser

## Overview

A simple tool to translate complex cron expressions into human-readable text. It removes the ambiguity of understanding schedule strings used in Linux `cron`, CI/CD pipelines, and cloud schedulers.

## Features

- Parses standard 5-part and 6-part cron expressions
- Handles ranges (`1-5`), steps (`*/5`), lists (`1,3,5`), and names (`MON-FRI`)
- Uses 24-hour time format for clarity

## How it Works

The tool relies on the `cronstrue` library which parses the fields of the cron string (minute, hour, day of month, month, day of week) and constructs a grammatically correct human-readable description.

## Examples

| Expression | Description |
|------------|-------------|
| `* * * * *` | Every minute |
| `0 12 * * *` | Every day at 12:00 |
| `*/15 * * * 1-5`| Every 15 minutes, Monday through Friday |

## Limitations

- Does not support special non-standard keywords like `@reboot` or `@daily` (though some platforms may support them, they are outside the standard 5/6-part syntax).
- Does not handle specific timezones (it interprets the schedule based on the system's timezone).

## References

- [cron on Wikipedia](https://en.wikipedia.org/wiki/Cron)
- [cronstrue on GitHub](https://github.com/bradymholt/cronstrue)
- [crontab.guru](https://crontab.guru/)
