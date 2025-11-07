import * as XLSX from "xlsx";
import { z } from "zod";

const ItemRowSchema = z.object({
  name: z.string().min(1),
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

export type ItemRow = z.infer<typeof ItemRowSchema>;

/**
 * Parse Excel file and validate rows
 */
export function parseExcelFile(file: File): Promise<{ valid: ItemRow[]; errors: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { raw: false });

        const valid: ItemRow[] = [];
        const errors: string[] = [];

        rows.forEach((row: any, index: number) => {
          try {
            const validated = ItemRowSchema.parse(row);
            valid.push(validated);
          } catch (error) {
            if (error instanceof z.ZodError) {
              errors.push(`Row ${index + 2}: ${error.errors.map((e) => e.message).join(", ")}`);
            } else {
              errors.push(`Row ${index + 2}: Invalid data`);
            }
          }
        });

        resolve({ valid, errors });
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Export items to Excel
 */
export function exportItemsToExcel(items: any[], filename = "inventory.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(
    items.map((item) => ({
      name: item.name,
      sku: item.sku || "",
      barcode: item.barcode || "",
      cost: item.cost || 0,
      mrsp: item.mrsp || 0,
      quantity: item.quantity || 0,
      unit: item.unit || "",
      category: item.category || "",
      location: item.location || "",
      notes: item.notes || "",
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

  XLSX.writeFile(workbook, filename);
}

/**
 * Generate Excel template
 */
export function generateExcelTemplate(filename = "inventory_template.xlsx") {
  const template = [
    {
      name: "Item Name",
      sku: "SKU-001",
      barcode: "1234567890123",
      cost: 10.5,
      mrsp: 15.0,
      quantity: 100,
      unit: "pcs",
      category: "Electronics",
      location: "Warehouse A",
      notes: "Sample item",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(template);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Items");

  XLSX.writeFile(workbook, filename);
}

