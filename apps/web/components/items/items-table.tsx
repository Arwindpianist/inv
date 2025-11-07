"use client";

import { useState, useEffect } from "react";
import { useItems } from "@mycelium-inv/db";
import { getTenantId } from "@mycelium-inv/utils";
import { createSupabaseClient } from "@mycelium-inv/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@mycelium-inv/ui";
import { Button } from "@mycelium-inv/ui";
import { ItemForm } from "./item-form";
import { ExcelImport } from "./excel-import";
import { ExcelExport } from "./excel-export";
import { formatCurrency, formatDate } from "@mycelium-inv/utils";

export function ItemsTable() {
  const [user, setUser] = useState<any>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

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

  const { items, isLoading, deleteItem } = useItems(tenantId || "");

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading items...</div>;
  }

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Items</h2>
          <p className="text-sm text-muted-foreground">{items.length} items</p>
        </div>
        <div className="flex gap-2">
          <ExcelImport />
          <ExcelExport />
          <Button onClick={() => {
            setEditingItem(null);
            setFormOpen(true);
          }}>
            Add Item
          </Button>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl shadow-[0_0_20px_rgba(92,141,247,0.15)] border border-border/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Barcode</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>MRSP</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No items found. Create your first item to get started.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.sku || "-"}</TableCell>
                  <TableCell>{item.barcode || "-"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.cost)}</TableCell>
                  <TableCell>{formatCurrency(item.mrsp)}</TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ItemForm item={editingItem} open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}

