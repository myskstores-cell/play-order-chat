/**
 * Single place where the Supabase client enters the application.
 * Only database/storage adapters may import this module.
 */
import { supabase } from "@/integrations/supabase/client";

export const supabaseClient = supabase;
