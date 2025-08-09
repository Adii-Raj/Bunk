import { useCallback } from "react";
import { supabase } from "../supabaseClient";

export function useSupabase() {
  const fetchTable = useCallback(async (table, match = {}) => {
    let query = supabase.from(table).select("*");
    if (Object.keys(match).length > 0) {
      query = query.match(match);
    }
    const { data, error } = await query;
    if (error) {
      console.error(`Error fetching ${table}:`, error.message);
      return null;
    }
    return data;
  }, []);

  const insertData = useCallback(async (table, values) => {
    const { data, error } = await supabase.from(table).insert(values);
    if (error) {
      console.error(`Error inserting into ${table}:`, error.message);
      return null;
    }
    return data;
  }, []);

  const upsertData = useCallback(async (table, values) => {
    const { data, error } = await supabase.from(table).upsert(values);
    if (error) {
      console.error(`Error upserting into ${table}:`, error.message);
      return null;
    }
    return data;
  }, []);

  const deleteData = useCallback(async (table, match) => {
    const { data, error } = await supabase.from(table).delete().match(match);
    if (error) {
      console.error(`Error deleting from ${table}:`, error.message);
      return null;
    }
    return data;
  }, []);

  return { fetchTable, insertData, upsertData, deleteData };
}
