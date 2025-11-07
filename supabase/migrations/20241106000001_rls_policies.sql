-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get tenant_id from JWT (created in public schema)
CREATE OR REPLACE FUNCTION public.tenant_id()
RETURNS uuid AS $$
  SELECT (auth.jwt() ->> 'tenant_id')::uuid;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Policies: users can only see their tenant's data
CREATE POLICY "tenant_isolation_users" ON users
  USING (tenant_id = public.tenant_id());

CREATE POLICY "tenant_isolation_items" ON items
  USING (tenant_id = public.tenant_id());

CREATE POLICY "tenant_isolation_scans" ON scans
  USING (tenant_id = public.tenant_id());

CREATE POLICY "tenant_isolation_groups" ON groups
  USING (tenant_id = public.tenant_id());

CREATE POLICY "tenant_isolation_group_items" ON group_items
  USING (
    EXISTS (
      SELECT 1 FROM groups g
      WHERE g.id = group_items.group_id
      AND g.tenant_id = public.tenant_id()
    )
  );

CREATE POLICY "tenant_isolation_logs" ON logs
  USING (tenant_id = public.tenant_id());

