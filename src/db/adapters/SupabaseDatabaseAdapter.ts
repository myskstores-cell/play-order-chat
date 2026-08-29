import { supabaseClient } from "@/db/supabase/supabaseClient";
import {
  DatabaseError,
  type DatabaseAdapter,
  type QueryOptions,
} from "./DatabaseAdapter";

export class SupabaseDatabaseAdapter implements DatabaseAdapter {
  async find<T>(
    table: string,
    filters: Record<string, unknown> = {},
    options: QueryOptions = {},
  ): Promise<T[]> {
    let query = supabaseClient.from(table).select("*");

    for (const [column, value] of Object.entries(filters)) {
      if (value === undefined) continue;
      if (Array.isArray(value)) query = query.in(column, value);
      else query = query.eq(column, value as never);
    }

    for (const order of options.orderBy ?? []) {
      query = query.order(order.column, { ascending: order.ascending ?? true });
    }

    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error) throw new DatabaseError(`Failed to load ${table}`, error);
    return (data ?? []) as T[];
  }

  async findById<T>(table: string, id: string): Promise<T | null> {
    const { data, error } = await supabaseClient
      .from(table)
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw new DatabaseError(`Failed to load ${table} record`, error);
    return (data as T | null) ?? null;
  }

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: row, error } = await supabaseClient
      .from(table)
      .insert(data as never)
      .select()
      .single();
    if (error) throw new DatabaseError(`Failed to create ${table} record`, error);
    return row as T;
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: row, error } = await supabaseClient
      .from(table)
      .update(data as never)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new DatabaseError(`Failed to update ${table} record`, error);
    return row as T;
  }

  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabaseClient.from(table).delete().eq("id", id);
    if (error) throw new DatabaseError(`Failed to delete ${table} record`, error);
  }
}
