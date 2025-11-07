import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseClient } from "../supabase";
import type { Database } from "../types";

type Item = Database["public"]["Tables"]["items"]["Row"];

export function useItems(tenantId: string) {
  const queryClient = useQueryClient();
  const supabase = createSupabaseClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["items", tenantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Item[];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (item: Omit<Item, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("items")
        .insert(item)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", tenantId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Item> & { id: number }) => {
      const { data, error } = await supabase
        .from("items")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Item;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", tenantId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items", tenantId] });
    },
  });

  return {
    items: data || [],
    isLoading,
    error,
    createItem: createMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
  };
}

