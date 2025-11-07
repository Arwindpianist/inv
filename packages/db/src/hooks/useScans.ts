import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "../supabase";
import type { Database } from "../types";

type Scan = Database["public"]["Tables"]["scans"]["Row"];

export function useScans(tenantId: string, limit = 50) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["scans", tenantId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scans")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("scanned_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as Scan[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (scan: Omit<Scan, "id" | "scanned_at">) => {
      const { data, error } = await supabase
        .from("scans")
        .insert(scan)
        .select()
        .single();

      if (error) throw error;
      return data as Scan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scans", tenantId] });
      queryClient.invalidateQueries({ queryKey: ["items", tenantId] });
    },
  });

  return {
    scans: data || [],
    isLoading,
    error,
    createScan: createMutation.mutate,
  };
}

