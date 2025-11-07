import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "../supabase";
import type { Database } from "../types";

type Group = Database["public"]["Tables"]["groups"]["Row"];

export function useGroups(tenantId: string) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("groups")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Group[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (group: Omit<Group, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("groups")
        .insert(group)
        .select()
        .single();

      if (error) throw error;
      return data as Group;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups", tenantId] });
    },
  });

  return {
    groups: data || [],
    isLoading,
    error,
    createGroup: createMutation.mutate,
  };
}

