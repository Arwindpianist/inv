import type { User } from "@supabase/supabase-js";

export type UserRole = "owner" | "manager" | "staff";

export interface UserWithTenant extends User {
  tenant_id?: string;
  role?: UserRole;
}

/**
 * Extract tenant_id from JWT claims
 */
export function getTenantId(user: UserWithTenant | null): string | null {
  if (!user) return null;
  return user.tenant_id || (user.user_metadata?.tenant_id as string) || null;
}

/**
 * Check if user has required role
 */
export function requireRole(user: UserWithTenant | null, requiredRole: UserRole): boolean {
  if (!user) return false;
  const userRole = user.role || (user.user_metadata?.role as UserRole);
  if (!userRole) return false;

  const roleHierarchy: Record<UserRole, number> = {
    staff: 1,
    manager: 2,
    owner: 3,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Check if user can manage users (owner or manager)
 */
export function canManageUsers(user: UserWithTenant | null): boolean {
  return requireRole(user, "manager");
}

/**
 * Check if user can manage inventory (all roles)
 */
export function canManageInventory(user: UserWithTenant | null): boolean {
  return !!user;
}

