import { knex } from "../db/knex.js";
import crypto from "crypto";

export async function createRole({ name, role_level = 3, description }, trx) {
  const [role] = await (trx || knex)('master.roles')
    .insert({ id: crypto.randomUUID(), name, role_level, description })
    .returning('*');
  return role;
}

export async function updateRole(roleId, { name, description }, trx) {
  const [role] = await (trx || knex)('master.roles')
    .where({ id: roleId })
    .update({ name, description, updated_at: knex.fn.now() })
    .returning('*');
  return role;
}

export async function deleteRole(roleId, trx) {
  await (trx || knex)('master.roles').where({ id: roleId }).del();
  return true;
}

export async function assignPermissionsToRole(roleId, permissionIds, trx) {
  const inserts = permissionIds.map(pid => ({
    id: crypto.randomUUID(),
    role_id: roleId,
    permission_id: pid
  }));
  await (trx || knex)('master.role_permissions').insert(inserts);
  return inserts;
}

export async function assignRolesToUser(userId, roleIds, tenantId = null, trx) {
  const inserts = roleIds.map(rid => ({
    id: crypto.randomUUID(),
    user_id: userId,
    role_id: rid,
    tenant_id: tenantId
  }));
  await (trx || knex)('master.user_roles').insert(inserts);
  return inserts;
}
