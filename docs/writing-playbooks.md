# Writing Playbooks

Playbooks are guided methodologies that organize individual security tools into structured workflows. This guide covers how to extend or write your own playbooks.

---

## Registry Layout

Playbooks are statically registered in:
`apps/web/src/features/playbooks/playbook-registry.ts`

To add or modify playbooks, you must update the `PLAYBOOKS` export array.

---

## Playbook Schema Definition

A Playbook object is structured as follows:

```typescript
export interface Playbook {
  id: string;                  // Unique identifier (used in routing)
  name: string;                // Visual display name
  description: string;         // Summary of the assessment flow
  category: 'recon' | 'auth' | 'web-security'; // Matching category tag
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string;                // Emoji display icon
  steps: PlaybookStep[];       // Ordered workflow steps
}
```

### PlaybookStep Structure

Each step represents an embedded tool inside the workflow:

```typescript
export interface PlaybookStep {
  id: string;                  // Step identifier
  title: string;               // Step navigation title
  toolId: string;              // Registered ID of the tool (must match manifest)
  purpose: string;             // Guidance detailing WHY this step is necessary
  suspiciousIndicators: string[]; // Checklist items for the analyst to evaluate
  estimatedSeconds?: number;   // Estimated audit time
}
```

---

## Step-by-Step Example

Here is how the **Domain Investigation** playbook is registered in `playbook-registry.ts`:

```typescript
export const PLAYBOOKS: Playbook[] = [
  {
    id: 'domain-investigation',
    name: 'Domain Investigation',
    description: 'Investigate a suspicious domain name step-by-step using OSINT and cryptographic auditing.',
    category: 'recon',
    difficulty: 'beginner',
    icon: '🌐',
    steps: [
      {
        id: 'whois',
        title: 'WHOIS Record',
        toolId: 'whois-lookup',
        purpose: 'Check the domain registration date, registrar registry details, and expiration date.',
        suspiciousIndicators: [
          'Domain registered very recently (less than 30 days old)',
          'Registrar information matches known throwaway registration providers',
          'Short lease duration (e.g. expires exactly one year from creation)'
        ],
        estimatedSeconds: 45
      },
      {
        id: 'dns',
        title: 'DNS Resolution',
        toolId: 'dns-lookup',
        purpose: 'Resolve DNS zones (A, AAAA, MX, TXT) to identify hosting architecture and mail routing.',
        suspiciousIndicators: [
          'High MX priority records pointing to unknown SMTP hosts',
          'Fast-flux DNS behaviors (multiple changing IP mappings)'
        ],
        estimatedSeconds: 30
      }
    ]
  }
];
```

---

## Key Best Practices

1.  **Reference Valid Tools**: The `toolId` must match the exact string returned in a tool's `manifest.ts` file. If a tool doesn't exist, the UI will fall back to displaying a redirection option.
2.  **Explicit Suspect Checklists**: Write clear, actionable suspicious indicators that help beginner security analysts understand what parameters represent a security threat.
3.  **Local Storage Tracking**: User progress is mapped automatically using `playbook_progress_<playbookId>`. Changes to step IDs will invalidate local progress for users actively performing assessments.
