import { z } from 'zod';
import type { PluginManifest } from '@security-studio/types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Loose semver regex — matches MAJOR.MINOR.PATCH with optional pre-release.
 * We don't need full semver-spec parsing, just enough to reject garbage.
 */
const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[\w.]+)?$/;

/**
 * Engine range regex — allows ranges like ">=1.0.0", ">=1.0.0 <2.0.0", "^1.0.0".
 * Intentionally loose; we validate more deeply at load-time.
 */
const ENGINE_RE = /^[<>=^~\d\s.*|+-]+$/;

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

const pluginInputSchema = z.object({
  name: z.string().min(1, 'Input name is required'),
  type: z.enum(['text', 'textarea', 'number', 'boolean', 'select', 'file']),
  label: z.string().min(1, 'Input label is required'),
  placeholder: z.string().optional(),
  default: z.unknown().optional(),
  required: z.boolean().optional(),
  options: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .optional(),
});

const pluginOutputSchema = z.object({
  name: z.string().min(1, 'Output name is required'),
  type: z.enum(['text', 'code', 'json', 'table', 'html']),
  label: z.string().min(1, 'Output label is required'),
});

// ---------------------------------------------------------------------------
// Main manifest schema
// ---------------------------------------------------------------------------

export const pluginManifestSchema = z.object({
  id: z
    .string()
    .min(1, 'Plugin id is required')
    .regex(/^[a-z0-9-]+$/, 'Plugin id must be lowercase alphanumeric with dashes'),

  name: z.string().min(1, 'Plugin name is required'),

  version: z
    .string()
    .regex(SEMVER_RE, 'Version must be a valid semver string (e.g. "1.0.0")'),

  description: z.string().min(1, 'Description is required'),

  author: z.string().min(1, 'Author is required'),

  category: z.enum([
    'encoding',
    'cryptography',
    'authentication',
    'web-security',
    'networking',
    'utilities',
    'forensics',
    'osint',
    'malware',
    'blue-team',
  ]),

  icon: z.string().min(1, 'Icon is required'),

  tags: z.array(z.string()).default([]),

  inputs: z.array(pluginInputSchema).min(1, 'At least one input is required'),

  outputs: z.array(pluginOutputSchema).min(1, 'At least one output is required'),

  permissions: z
    .array(
      z.enum([
        'logger',
        'storage',
        'clipboard',
        'network',
        'filesystem',
        'workspace',
        'history',
        'settings',
        'shell',
        'process',
        'system',
      ])
    )
    .default([]),

  engine: z
    .string()
    .regex(ENGINE_RE, 'Engine must be a valid semver range')
    .optional(),

  homepage: z.string().url('Homepage must be a valid URL').optional(),

  license: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Validation result type
// ---------------------------------------------------------------------------

export interface ManifestValidationError {
  field: string;
  message: string;
}

export interface ManifestValidationResult {
  valid: boolean;
  manifest?: PluginManifest;
  errors?: ManifestValidationError[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Validates a raw JSON object against the PluginManifest schema.
 * Returns a typed result with either the parsed manifest or structured errors.
 */
export function validateManifest(raw: unknown): ManifestValidationResult {
  const result = pluginManifestSchema.safeParse(raw);

  if (result.success) {
    return { valid: true, manifest: result.data as PluginManifest };
  }

  const errors: ManifestValidationError[] = result.error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }));

  return { valid: false, errors };
}

/**
 * Simple semver satisfies check.
 * Supports: >=X.Y.Z, <=X.Y.Z, >X.Y.Z, <X.Y.Z, ^X.Y.Z, ~X.Y.Z
 * Handles compound ranges separated by spaces (AND logic).
 */
export function semverSatisfies(version: string, range: string): boolean {
  const parts = parseVersion(version);
  if (!parts) return false;

  // Split range by spaces and all parts must be satisfied (AND)
  const constraints = range.trim().split(/\s+/);

  for (const constraint of constraints) {
    if (!checkConstraint(parts, constraint)) {
      return false;
    }
  }

  return true;
}

// ---------------------------------------------------------------------------
// Internal semver helpers
// ---------------------------------------------------------------------------

interface SemverParts {
  major: number;
  minor: number;
  patch: number;
}

function parseVersion(v: string): SemverParts | null {
  const match = v.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1] as string, 10),
    minor: parseInt(match[2] as string, 10),
    patch: parseInt(match[3] as string, 10),
  };
}

function compareVersions(a: SemverParts, b: SemverParts): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}

function checkConstraint(version: SemverParts, constraint: string): boolean {
  // ^X.Y.Z — compatible with version (same major)
  if (constraint.startsWith('^')) {
    const target = parseVersion(constraint.slice(1));
    if (!target) return false;
    const cmp = compareVersions(version, target);
    return version.major === target.major && cmp >= 0;
  }

  // ~X.Y.Z — approximately equivalent (same major.minor)
  if (constraint.startsWith('~')) {
    const target = parseVersion(constraint.slice(1));
    if (!target) return false;
    const cmp = compareVersions(version, target);
    return version.major === target.major && version.minor === target.minor && cmp >= 0;
  }

  // >=X.Y.Z
  if (constraint.startsWith('>=')) {
    const target = parseVersion(constraint.slice(2));
    if (!target) return false;
    return compareVersions(version, target) >= 0;
  }

  // <=X.Y.Z
  if (constraint.startsWith('<=')) {
    const target = parseVersion(constraint.slice(2));
    if (!target) return false;
    return compareVersions(version, target) <= 0;
  }

  // >X.Y.Z
  if (constraint.startsWith('>')) {
    const target = parseVersion(constraint.slice(1));
    if (!target) return false;
    return compareVersions(version, target) > 0;
  }

  // <X.Y.Z
  if (constraint.startsWith('<')) {
    const target = parseVersion(constraint.slice(1));
    if (!target) return false;
    return compareVersions(version, target) < 0;
  }

  // Exact match
  const target = parseVersion(constraint);
  if (!target) return false;
  return compareVersions(version, target) === 0;
}
