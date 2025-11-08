import { ItemsTable } from "@/components/items/items-table";

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold tracking-tight">Items</h1>
      <ItemsTable />
    </div>
  );
}

