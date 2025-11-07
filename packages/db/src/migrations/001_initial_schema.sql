-- Tenants table
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamp DEFAULT now()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('owner', 'manager', 'staff')),
  created_at timestamp DEFAULT now()
);

-- Items table
CREATE TABLE items (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  barcode text,
  cost numeric(12,2),
  mrsp numeric(12,2),
  quantity integer DEFAULT 0,
  unit text,
  category text,
  location text,
  notes text,
  created_at timestamp DEFAULT now(),
  UNIQUE(tenant_id, sku),
  UNIQUE(tenant_id, barcode)
);

-- Scans table
CREATE TABLE scans (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  item_id bigint NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity_delta integer NOT NULL,
  note text,
  photo_url text,
  location text,
  scanned_at timestamp DEFAULT now()
);

-- Groups table
CREATE TABLE groups (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  created_at timestamp DEFAULT now()
);

-- Group items junction
CREATE TABLE group_items (
  id bigserial PRIMARY KEY,
  group_id bigint NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  item_id bigint NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  quantity integer DEFAULT 0,
  UNIQUE(group_id, item_id)
);

-- Activity logs
CREATE TABLE logs (
  id bigserial PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action text NOT NULL,
  details jsonb,
  created_at timestamp DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_items_tenant ON items(tenant_id);
CREATE INDEX idx_items_barcode ON items(tenant_id, barcode);
CREATE INDEX idx_scans_tenant ON scans(tenant_id);
CREATE INDEX idx_scans_item ON scans(item_id);
CREATE INDEX idx_logs_tenant ON logs(tenant_id);
CREATE INDEX idx_logs_created ON logs(created_at DESC);

