
// ----------------------------
// Tenant-aware RBAC service
// ----------------------------
// export const RBACService = {
//   // Create role
//   createRole: async (tenantDb, { name, role_level, description }) => {
//     const existing = await tenantDb('roles').where({ name }).first();
//     if (existing) throw new Error('Role already exists');

//     const [role] = await tenantDb('roles')
//       .insert({
//         id: uuidv4(),
//         name,
//         role_level,
//         description,
//         created_at: new Date(),
//         updated_at: new Date()
//       })
//       .returning('*');

//     return role;
//   },

//   // Update role
//   updateRole: async (tenantDb, roleId, { name, role_level, description }) => {
//     const [role] = await tenantDb('roles')
//       .where({ id: roleId })
//       .update({
//         name,
//         role_level,
//         description,
//         updated_at: new Date()
//       })
//       .returning('*');
//     return role;
//   },

//   // Delete role
//   deleteRole: async (tenantDb, roleId) => {
//     await tenantDb('roles').where({ id: roleId }).del();
//     return true;
//   },

//   // Assign permissions to role
//   assignPermissionsToRole: async (tenantDb, roleId, permissionIds) => {
//     const inserts = permissionIds.map(pid => ({ role_id: roleId, permission_id: pid }));
//     await tenantDb('role_permissions').insert(inserts).onConflict(['role_id','permission_id']).ignore();
//     return inserts;
//   },

//   // Assign roles to user
//   assignRolesToUser: async (tenantDb, userId, roleIds) => {
//     const inserts = roleIds.map(rid => ({ user_id: userId, role_id: rid }));
//     await tenantDb('user_roles').insert(inserts).onConflict(['user_id','role_id']).ignore();
//     return inserts;
//   },

//   // Get user roles & permissions
//   getUserRolesPermissions: async (tenantDb, userId) => {
//     const roles = await tenantDb('user_roles as ur')
//       .join('roles as r', 'ur.role_id', 'r.id')
//       .where('ur.user_id', userId)
//       .select('r.id','r.name','r.role_level');

//     const permissions = await tenantDb('role_permissions as rp')
//       .join('permissions as p','rp.permission_id','p.id')
//       .whereIn('rp.role_id', roles.map(r => r.id))
//       .select('p.id','p.name');

//     return { roles, permissions };
//   }
// };


// src/modules/rbac/rbac.service.js
import { v4 as uuidv4 } from "uuid";
import { knex } from "../../db/knex.js"; // master DB for audit logging
import { auditLog } from "../../utils/auditLogger.js";

/**
 * ------------------------
 * ROLES
 * ------------------------
 */
export async function createRole({ name, description }, tenantDb, userId, tenantId) {
  const id = uuidv4();
  const [role] = await tenantDb("roles")
    .insert({ id, name, description, created_at: new Date(), updated_at: new Date() })
    .returning("*");

  // Audit log
  await auditLog(knex, {
    userId,
    tenantId,
    action: "ROLE_CREATED",
    resource: "roles",
    resourceId: id,
    metadata: role,
  });

  return role;
}

export async function updateRole(roleId, { name, description }, tenantDb, userId, tenantId) {
  const [role] = await tenantDb("roles")
    .where({ id: roleId })
    .update({ name, description, updated_at: new Date() })
    .returning("*");

  await auditLog(knex, {
    userId,
    tenantId,
    action: "ROLE_UPDATED",
    resource: "roles",
    resourceId: roleId,
    metadata: role,
  });

  return role;
}

export async function deleteRole(roleId, tenantDb, userId, tenantId) {
  await tenantDb("roles").where({ id: roleId }).del();

  await auditLog(knex, {
    userId,
    tenantId,
    action: "ROLE_DELETED",
    resource: "roles",
    resourceId: roleId,
  });

  return true;
}

export async function getRoles(tenantDb) {
  return tenantDb("roles").select("*");
}

/**
 * ------------------------
 * PERMISSIONS
 * ------------------------
 */
export async function createPermission({ key, module, description }, tenantDb, userId, tenantId) {
  const id = uuidv4();
  const [permission] = await tenantDb("permissions")
    .insert({ id, key, module, description, created_at: new Date(), updated_at: new Date() })
    .returning("*");

  await auditLog(knex, {
    userId,
    tenantId,
    action: "PERMISSION_CREATED",
    resource: "permissions",
    resourceId: id,
    metadata: permission,
  });

  return permission;
}

export async function updatePermission(permissionId, { key, module, description }, tenantDb, userId, tenantId) {
  const [permission] = await tenantDb("permissions")
    .where({ id: permissionId })
    .update({ key, module, description, updated_at: new Date() })
    .returning("*");

  await auditLog(knex, {
    userId,
    tenantId,
    action: "PERMISSION_UPDATED",
    resource: "permissions",
    resourceId: permissionId,
    metadata: permission,
  });

  return permission;
}

export async function deletePermission(permissionId, tenantDb, userId, tenantId) {
  await tenantDb("permissions").where({ id: permissionId }).del();

  await auditLog(knex, {
    userId,
    tenantId,
    action: "PERMISSION_DELETED",
    resource: "permissions",
    resourceId: permissionId,
  });

  return true;
}

export async function getPermissions(tenantDb) {
  return tenantDb("permissions").select("*");
}

/**
 * ------------------------
 * ROLE-PERMISSIONS
 * ------------------------
 */
export async function assignPermissions(roleId, permissionIds, tenantDb, userId, tenantId) {
  const inserts = permissionIds.map(pid => ({ id: uuidv4(), role_id: roleId, permission_id: pid }));
  await tenantDb("role_permissions").insert(inserts).onConflict(['role_id','permission_id']).ignore();

  await auditLog(knex, {
    userId,
    tenantId,
    action: "ROLE_PERMISSIONS_ASSIGNED",
    resource: "role_permissions",
    resourceId: roleId,
    metadata: { permission_ids: permissionIds },
  });

  return inserts;
}

export async function getRolePermissions(roleId, tenantDb) {
  return tenantDb("role_permissions as rp")
    .join("permissions as p", "rp.permission_id", "p.id")
    .where("rp.role_id", roleId)
    .select("p.id", "p.key", "p.module", "p.description");
}

/**
 * ------------------------
 * USER-ROLES
 * ------------------------
 */
export async function assignRoles(userId, roleIds, tenantDb, userAuditId, tenantId) {
  const inserts = roleIds.map(rid => ({ id: uuidv4(), user_id: userId, role_id: rid }));
  await tenantDb("user_roles").insert(inserts).onConflict(['user_id','role_id']).ignore();

  await auditLog(knex, {
    userId: userAuditId,
    tenantId,
    action: "USER_ROLES_ASSIGNED",
    resource: "user_roles",
    resourceId: userId,
    metadata: { role_ids: roleIds },
  });

  return inserts;
}

export async function getUserRolesPermissions(userId, tenantDb) {
  const roles = await tenantDb("user_roles as ur")
    .join("roles as r", "ur.role_id", "r.id")
    .where("ur.user_id", userId)
    .select("r.id", "r.name", "r.description");

  const permissions = await tenantDb("role_permissions as rp")
    .join("permissions as p", "rp.permission_id", "p.id")
    .whereIn("rp.role_id", roles.map(r => r.id))
    .select("p.id", "p.key", "p.module", "p.description");

  return { roles, permissions };
}
