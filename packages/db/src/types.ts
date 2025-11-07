// Generated types from Supabase
// Run: supabase gen types typescript --local > src/types.ts
// Or: supabase gen types typescript --project-id <project-id> > src/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          tenant_id: string;
          email: string;
          role: "owner" | "manager" | "staff";
          created_at: string;
        };
        Insert: {
          id: string;
          tenant_id: string;
          email: string;
          role: "owner" | "manager" | "staff";
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          email?: string;
          role?: "owner" | "manager" | "staff";
          created_at?: string;
        };
      };
      items: {
        Row: {
          id: number;
          tenant_id: string;
          name: string;
          sku: string | null;
          barcode: string | null;
          cost: number | null;
          mrsp: number | null;
          quantity: number;
          unit: string | null;
          category: string | null;
          location: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          tenant_id: string;
          name: string;
          sku?: string | null;
          barcode?: string | null;
          cost?: number | null;
          mrsp?: number | null;
          quantity?: number;
          unit?: string | null;
          category?: string | null;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          tenant_id?: string;
          name?: string;
          sku?: string | null;
          barcode?: string | null;
          cost?: number | null;
          mrsp?: number | null;
          quantity?: number;
          unit?: string | null;
          category?: string | null;
          location?: string | null;
          notes?: string | null;
          created_at?: string;
        };
      };
      scans: {
        Row: {
          id: number;
          tenant_id: string;
          item_id: number;
          user_id: string;
          quantity_delta: number;
          note: string | null;
          photo_url: string | null;
          location: string | null;
          scanned_at: string;
        };
        Insert: {
          id?: number;
          tenant_id: string;
          item_id: number;
          user_id: string;
          quantity_delta: number;
          note?: string | null;
          photo_url?: string | null;
          location?: string | null;
          scanned_at?: string;
        };
        Update: {
          id?: number;
          tenant_id?: string;
          item_id?: number;
          user_id?: string;
          quantity_delta?: number;
          note?: string | null;
          photo_url?: string | null;
          location?: string | null;
          scanned_at?: string;
        };
      };
      groups: {
        Row: {
          id: number;
          tenant_id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          tenant_id: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      group_items: {
        Row: {
          id: number;
          group_id: number;
          item_id: number;
          quantity: number;
        };
        Insert: {
          id?: number;
          group_id: number;
          item_id: number;
          quantity?: number;
        };
        Update: {
          id?: number;
          group_id?: number;
          item_id?: number;
          quantity?: number;
        };
      };
      logs: {
        Row: {
          id: number;
          tenant_id: string;
          user_id: string;
          action: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          tenant_id: string;
          user_id: string;
          action: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          tenant_id?: string;
          user_id?: string;
          action?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

