import type { DatabaseAdapter } from "./adapters/DatabaseAdapter";
import { SupabaseDatabaseAdapter } from "./adapters/SupabaseDatabaseAdapter";

let adapter: DatabaseAdapter = new SupabaseDatabaseAdapter();

/** Swap the provider (tests, migration to another backend) without touching the UI. */
export function setDatabaseAdapter(next: DatabaseAdapter) {
  adapter = next;
}

export function getDatabase(): DatabaseAdapter {
  return adapter;
}
