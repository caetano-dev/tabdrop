/**
 * Represents a saved link/tab in the collection
 */
export interface SavedLink {
  url: string;
  title?: string;
  addedAt: string;
}

/**
 * Represents a collection of links stored in Supabase
 */
export interface Collection {
  id?: number;
  slug: string;
  links: SavedLink[];
  created_at?: string;
  updated_at?: string;
}

/**
 * Database row structure for the collections table
 */
export interface CollectionRow {
  id: number;
  slug: string;
  links: SavedLink[];
  created_at: string;
  updated_at: string;
}