/**
 * Provider-agnostic database contract.
 * Services depend on this interface only — never on a concrete provider.
 */
export interface QueryOptions {
  orderBy?: { column: string; ascending?: boolean }[];
  limit?: number;
}

export interface DatabaseAdapter {
  find<T>(
    table: string,
    filters?: Record<string, unknown>,
    options?: QueryOptions,
  ): Promise<T[]>;

  findById<T>(table: string, id: string): Promise<T | null>;

  create<T>(table: string, data: Partial<T>): Promise<T>;

  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;

  delete(table: string, id: string): Promise<void>;
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    override readonly cause?: unknown,
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}
