import Fuse from 'fuse.js';
import type { ToolManifest } from '@security-studio/types';

export interface SearchResult {
  item: ToolManifest;
  score: number;
  matches: ReadonlyArray<Fuse.FuseResultMatch> | undefined;
}

/**
 * Fuzzy search index built from tool manifests.
 * Single source of truth for: ⌘K palette, sidebar, dashboard search, All Tools page.
 */
class SearchIndex {
  private fuse: Fuse<ToolManifest> | null = null;
  private manifests: ToolManifest[] = [];

  /** Rebuild the index from a new set of manifests */
  build(manifests: ToolManifest[]): void {
    this.manifests = manifests;
    this.fuse = new Fuse(manifests, {
      keys: [
        { name: 'name', weight: 0.35 },
        { name: 'description', weight: 0.2 },
        { name: 'tags', weight: 0.2 },
        { name: 'keywords', weight: 0.15 },
        { name: 'category', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    });
  }

  /** Search for tools by query string */
  search(query: string): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return this.manifests.map((item) => ({ item, score: 0, matches: undefined }));
    }
    return this.fuse.search(query).map((result) => ({
      item: result.item,
      score: result.score ?? 0,
      matches: result.matches,
    }));
  }

  /** Get all manifests (unfiltered) */
  getAll(): ToolManifest[] {
    return this.manifests;
  }

  get size(): number {
    return this.manifests.length;
  }
}

/** Singleton search index */
export const searchIndex = new SearchIndex();
export { SearchIndex };
