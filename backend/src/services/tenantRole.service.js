import crypto from "crypto";

export async function createTenantRole(tenantDb, { name, description, role_level = 3 }) {
  const [role] = await tenantDb("roles")
    .insert({
      id: crypto.randomUUID(),
      name,
      description,
      role_level,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning("*");

  return role;
}

export async function updateTenantRole(tenantDb, roleId, data) {
  const [role] = await tenantDb("roles")
    .where({ id: roleId })
    .update({
      ...data,
      updated_at: new Date(),
    })
    .returning("*");

  return role;
}

export async function assignPermissions(tenantDb, roleId, permissionIds) {
  const rows = permissionIds.map(pid => ({
    id: crypto.randomUUID(),
    role_id: roleId,
    permission_id: pid
  }));

  await tenantDb("role_permissions").insert(rows);

  return rows;
}

export async function assignRoleToUser(tenantDb, userId, roleId) {
  return tenantDb("user_roles").insert({
    id: crypto.randomUUID(),
    user_id: userId,
    role_id: roleId,
    created_at: new Date()
  });
}

export async function getRoleByName(tenantDb, name) {
  return tenantDb("roles").where({ name }).first();
}
