"use server";

import { createSupabaseServerClient } from "@mycelium-inv/db";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { Database } from "@mycelium-inv/db";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

async function getCookies() {
  const cookieStore = (await cookies()) as CookieStore & {
    set: (name: string, value: string, options?: any) => void;
  };

  return {
    get: (name: string) => cookieStore.get(name),
    set: (name: string, value: string, options?: any) => {
      cookieStore.set(name, value, options);
    },
  };
}

type ItemInsert = Database["public"]["Tables"]["items"]["Insert"];
type ItemUpdate = Database["public"]["Tables"]["items"]["Update"];

export async function createItem(
  item: Omit<ItemInsert, "tenant_id" | "created_at">
) {
  const supabase = createSupabaseServerClient(await getCookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const tenantId = user.user_metadata?.tenant_id;
  if (!tenantId) {
    throw new Error("No tenant ID");
  }

  const { data: createdItem, error } = await supabase
    .from("items")
    .insert({
      ...item,
      tenant_id: tenantId,
    })
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/dashboard/items");
  return createdItem;
}

export async function updateItem(id: number, data: ItemUpdate) {
  const supabase = createSupabaseServerClient(await getCookies());
  const { data: item, error } = await supabase
    .from("items")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  revalidatePath("/dashboard/items");
  return item;
}

export async function deleteItem(id: number) {
  const supabase = createSupabaseServerClient(await getCookies());
  const { error } = await supabase.from("items").delete().eq("id", id);

  if (error) throw error;
  revalidatePath("/dashboard/items");
}

export async function getItems() {
  const supabase = createSupabaseServerClient(await getCookies());
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const tenantId = user.user_metadata?.tenant_id;
  if (!tenantId) {
    throw new Error("No tenant ID");
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

