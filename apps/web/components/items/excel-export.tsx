"use client";

import { exportItemsToExcel } from "@mycelium-inv/utils";
import { useItems } from "@mycelium-inv/db";
import { getTenantId } from "@mycelium-inv/utils";
import { createSupabaseClient } from "@mycelium-inv/db";
import { Button } from "@mycelium-inv/ui";
import { useState, useEffect } from "react";

export function ExcelExport() {
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const { items } = useItems(tenantId || "");

  useEffect(() => {
    const supabase = createSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        const tid = getTenantId(user);
        setTenantId(tid);
      }
    });
  }, []);

  const handleExport = () => {
    exportItemsToExcel(items, `inventory_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  return (
    <Button onClick={handleExport} variant="outline" disabled={items.length === 0}>
      Export Excel
    </Button>
  );
}

