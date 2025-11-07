"use client";

import { useState } from "react";
import { parseExcelFile, generateExcelTemplate } from "@mycelium-inv/utils";
import { Button } from "@mycelium-inv/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mycelium-inv/ui";
import { createItem } from "@/lib/actions/items";

export function ExcelImport() {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<{ valid: any[]; errors: string[] } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    try {
      const result = await parseExcelFile(selectedFile);
      setPreview(result);
    } catch (error) {
      console.error("Error parsing file:", error);
    }
  };

  const handleImport = async () => {
    if (!preview || preview.valid.length === 0) return;

    setLoading(true);
    try {
      for (const item of preview.valid) {
        await createItem(item);
      }
      setOpen(false);
      setFile(null);
      setPreview(null);
      window.location.reload();
    } catch (error) {
      console.error("Error importing items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    generateExcelTemplate();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        Import Excel
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Import Items from Excel</DialogTitle>
            <DialogDescription>
              Upload an Excel file to bulk import items. Download the template to see the required format.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Button onClick={handleDownloadTemplate} variant="outline" size="sm">
                Download Template
              </Button>
            </div>
            <div>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="w-full"
              />
            </div>
            {preview && (
              <div className="space-y-2">
                <p className="text-sm">
                  Valid rows: <span className="font-semibold">{preview.valid.length}</span>
                </p>
                {preview.errors.length > 0 && (
                  <div className="text-sm text-destructive">
                    <p className="font-semibold">Errors:</p>
                    <ul className="list-disc list-inside">
                      {preview.errors.slice(0, 10).map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!preview || preview.valid.length === 0 || loading}>
              {loading ? "Importing..." : `Import ${preview?.valid.length || 0} Items`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

