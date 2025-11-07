# 🧾 Product Requirements Document (PRD)
## Project: INV.MyceliumLink  
**Domain:** [inv.mycelliumlink.com](https://inv.mycelliumlink.com)  
**Backend:** Supabase (Postgres + Auth + Storage)  
**Frontend:** Next.js (Web), Expo (Mobile Scanner)  
**Design Base:** myceliumlink styles (shared aesthetics and theme)

---

## 🎯 Objective
Create a **multi-tenant inventory management system** for companies involved in:
- Fiber works and cabling
- ICT system integration
- CCTV and security systems
- Server, laptop, and PC provisioning
- Manpower and technical support
- Construction-related material management

System must allow each tenant to manage items, groups, and resource pools efficiently,  
with mobile scanning support and Excel import/export capabilities.

---

## 🏗️ Core Modules

### 1. Authentication & Tenancy
- Supabase Auth (email/password, magic link)
- Each user belongs to a tenant (company)
- Tenant isolation using Row-Level Security (RLS)
- Roles:
  - **Owner:** full control, billing
  - **Manager:** manage stock, users, and groups
  - **Staff:** scan and update inventory only

---

### 2. Inventory Management
- Track **items**, **quantity**, **cost**, **MRSP**, **barcode**, **location**, **supplier**
- Auto-generate or scan barcodes (support camera or smart scanner)
- Support manual creation and bulk import via Excel
- View stock by:
  - Group / resource pool
  - Category / item type
  - Location / project

**Fields:**
| Field | Type | Description |
|-------|------|--------------|
| id | bigint | Primary key |
| tenant_id | uuid | Tenant reference |
| name | text | Item name |
| sku | text | Optional unique code |
| barcode | text | Unique item barcode |
| cost | numeric(12,2) | Base cost |
| mrsp | numeric(12,2) | Recommended selling price |
| quantity | integer | Current stock count |
| unit | text | Unit of measurement (pcs, m, set, etc.) |
| category | text | Item category |
| location | text | Physical storage or project site |
| notes | text | Optional description |
| created_at | timestamp | Auto timestamp |

---

### 3. Scans & Adjustments (Mobile Module)
- Lightweight mobile app (Expo) or PWA for on-site staff
- Core actions:
  - Scan barcode → fetch item → show details
  - Adjust stock (increase/decrease)
  - Add note, quantity, or photo evidence
  - Offline-first capability (sync when online)
- Background sync job runs automatically
- Supabase trigger updates master quantity

**Table: scans**
| Field | Type | Description |
|-------|------|--------------|
| id | bigint | Primary key |
| tenant_id | uuid | Tenant reference |
| item_id | bigint | Item reference |
| user_id | uuid | User performing scan |
| quantity_delta | integer | Positive/negative change |
| note | text | Reason or detail |
| photo_url | text | Optional image |
| location | text | Site of update |
| scanned_at | timestamp | Auto timestamp |

**Trigger:**
Automatically adjust item quantity after each scan insert.

---

### 4. Groups / Resource Pools
- Users can create **custom groups** (e.g. “Team Alpha”, “Fiber Works”, “Warehouse 1”)
- Assign items to groups
- Transfer items between groups
- Track stock levels per group

**Table: groups**
| Field | Type | Description |
|-------|------|--------------|
| id | bigint | Primary key |
| tenant_id | uuid | Tenant reference |
| name | text | Group name |
| description | text | Optional description |
| created_at | timestamp | Auto timestamp |

**Table: group_items**
| Field | Type | Description |
|-------|------|--------------|
| id | bigint | Primary key |
| group_id | bigint | Group reference |
| item_id | bigint | Item reference |
| quantity | integer | Group-specific quantity |

---

### 5. Import & Export
- **Excel Import:** bulk item creation/update (xlsx/csv)
- **Excel Export:** full stock list for reports
- Upload through web UI
- Data validation before committing changes

---

### 6. Activity Logs
- Every stock adjustment, import, or transfer is logged
- Logs visible per tenant only
- Filter by user, item, date, or group

**Table: logs**
| Field | Type | Description |
|-------|------|--------------|
| id | bigint | Primary key |
| tenant_id | uuid | Tenant reference |
| user_id | uuid | User performing action |
| action | text | e.g., “ADD_STOCK”, “IMPORT”, “TRANSFER” |
| details | jsonb | Structured metadata |
| created_at | timestamp | Auto timestamp |

---

### 7. User Interface

#### Web (Next.js)
- Dashboard (summary, alerts, stock trends)
- Items table (sortable, searchable)
- Item editor (CRUD)
- Excel import/export
- Group management
- Logs and activity
- Role-based settings

#### Mobile (Expo/PWA)
- Login screen
- Quick-scan screen (auto open camera)
- Item details + adjustment form
- Sync indicator (offline/pending/synced)
- Minimalistic dark UI matching MyceliumLink theme

---

### 8. Supabase Configuration

#### Database
- Postgres 16 with RLS per tenant
- Schema: `public`
- Triggers for real-time updates and auto quantity sync

#### Auth
- Supabase Auth (email/password + magic link)
- Tenants stored separately in `tenants` table
- `tenant_id` assigned to each user upon registration

#### Storage
- Supabase Storage for images (item photos, scan proofs)
- Folder structure:

/tenants/{tenant_id}/items/
/tenants/{tenant_id}/scans/


---

### 9. Efficiency & Optimization
- Use Supabase row-level caching (SWR) for web dashboard
- Use delta-based stock adjustments (no full updates)
- Lightweight JSON logs (compressed)
- Background jobs (Edge Functions) for sync and cleanup
- Storage-efficient schema design (minimal joins, numeric compression)

---

### 10. Deployment
| Layer | Platform | Notes |
|--------|-----------|--------|
| Web | Vercel | inv.mycelliumlink.com |
| Mobile | Expo EAS / PWA | for scanning |
| Backend | Supabase | Database, auth, storage |
| CDN / DNS | Cloudflare | Domain + caching |
| CI/CD | GitHub Actions | Auto deploy both apps |

---

### 11. UI Design Guidelines
- Use **myceliumlink shared styles** (typography, color tokens, shadows)
- Dark theme by default
- Smooth glassmorphism and neon accents
- Responsive grid layout on desktop
- Minimal screens on mobile (scanner-first UX)

---

### 12. Security
- RLS for tenant isolation
- Supabase policies:
```sql
CREATE POLICY "tenant_isolation" ON items
USING (tenant_id = auth.uid());
````

* Signed URLs for photo uploads
* Activity log for all data mutations
* Auto logout after 24 hours inactivity

---

### 13. Future Extension (optional hooks)

* Integration with billing (Stripe / Lemon Squeezy)
* Multi-site stock analytics
* AI-based demand prediction
* Automatic reorder alerts
* Integration with MyceliumLink data sync (migration-ready)

---

**Owner:** Arwin Kumar (MyceliumLink)
**Repo Name:** `mycelium-inv`
**Frontend Framework:** Next.js (web), Expo (mobile)
**Database Provider:** Supabase

---
