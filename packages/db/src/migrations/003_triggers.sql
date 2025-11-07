-- Quantity sync trigger
CREATE OR REPLACE FUNCTION update_item_quantity()
RETURNS trigger AS $$
BEGIN
  UPDATE items
  SET quantity = quantity + NEW.quantity_delta
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_quantity
AFTER INSERT ON scans
FOR EACH ROW
EXECUTE FUNCTION update_item_quantity();

-- Auto-log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS trigger AS $$
BEGIN
  INSERT INTO logs (tenant_id, user_id, action, details)
  VALUES (
    NEW.tenant_id,
    NEW.user_id,
    'SCAN',
    jsonb_build_object(
      'item_id', NEW.item_id,
      'quantity_delta', NEW.quantity_delta,
      'location', NEW.location
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_log_scan
AFTER INSERT ON scans
FOR EACH ROW
EXECUTE FUNCTION log_activity();

