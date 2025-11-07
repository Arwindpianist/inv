"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@mycelium-inv/ui";
import { Input } from "@mycelium-inv/ui";
import { Label } from "@mycelium-inv/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mycelium-inv/ui";
import { createItem, updateItem } from "@/lib/actions/items";
import { useState } from "react";

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  cost: z.coerce.number().optional(),
  mrsp: z.coerce.number().optional(),
  quantity: z.coerce.number().default(0),
  unit: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

interface ItemFormProps {
  item?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ItemForm({ item, open, onOpenChange }: ItemFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: item || {
      name: "",
      sku: "",
      barcode: "",
      cost: 0,
      mrsp: 0,
      quantity: 0,
      unit: "",
      category: "",
      location: "",
      notes: "",
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    setLoading(true);
    try {
      if (item) {
        await updateItem(item.id, data);
      } else {
        await createItem(data);
      }
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Item" : "Create Item"}</DialogTitle>
          <DialogDescription>
            {item ? "Update item details" : "Add a new item to inventory"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register("sku")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="barcode">Barcode</Label>
              <Input id="barcode" {...register("barcode")} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" {...register("quantity")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="cost">Cost</Label>
              <Input id="cost" type="number" step="0.01" {...register("cost")} />
            </div>
            <div>
              <Label htmlFor="mrsp">MRSP</Label>
              <Input id="mrsp" type="number" step="0.01" {...register("mrsp")} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" {...register("unit")} placeholder="pcs, m, kg, etc." />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Input id="category" {...register("category")} />
            </div>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" {...register("location")} />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" {...register("notes")} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

