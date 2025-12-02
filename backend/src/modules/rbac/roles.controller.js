

// import { knex } from "../../db/knex.js";
// import { v4 as uuidv4 } from "uuid";
// import { auditLog } from "../../utils/auditLogger.js";

// // ----------------------------
// // Create a new role (tenant-specific)
// // ----------------------------
// export const createRole = async (req, res) => {
//   try {
//     const { name, role_level, description } = req.body;
//     if (!name || !role_level)
//       return res.status(400).json({ message: "Name & role_level required" });

//     // Ensure role name is unique for this tenant
//     const existing = await knex("master.roles")
//       .where({ name, tenant_id: req.tenant.id })
//       .first();
//     if (existing)
//       return res.status(400).json({ message: "Role name already exists for this tenant" });

//     const id = uuidv4();
//     const [role] = await knex("master.roles")
//       .insert({ id, name, role_level, description, tenant_id: req.tenant.id, created_at: new Date(), updated_at: new Date() })
//       .returning("*");

//     // Audit log
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant.id,
//       action: "ROLE_CREATED",
//       resource: "role",
//       resourceId: id,
//       metadata: role,
//       req,
//     });

//     return res.status(201).json({ message: "Role created", role });
//   } catch (err) {
//     console.error("Error creating role:", err);
//     return res.status(500).json({ message: "Failed to create role", error: err.message });
//   }
// };

// // ----------------------------
// // Assign permissions to a role (tenant-aware)
// // ----------------------------
// export const assignPermissions = async (req, res) => {
//   try {
//     const { role_id, permission_ids } = req.body;
//     if (!role_id || !permission_ids?.length)
//       return res.status(400).json({ message: "role_id and permission_ids required" });

//     // Ensure role belongs to this tenant
//     const role = await knex("master.roles").where({ id: role_id, tenant_id: req.tenant.id }).first();
//     if (!role) return res.status(404).json({ message: "Role not found or not allowed" });

//     const inserts = permission_ids.map(pid => ({ role_id, permission_id: pid }));
//     await knex("master.role_permissions").insert(inserts).onConflict(['role_id','permission_id']).ignore();

//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant.id,
//       action: "ROLE_PERMISSIONS_ASSIGNED",
//       resource: "role_permissions",
//       resourceId: role_id,
//       metadata: { permission_ids },
//       req,
//     });

//     return res.json({ message: "Permissions assigned to role" });
//   } catch (err) {
//     console.error("Error assigning permissions:", err);
//     return res.status(500).json({ message: "Failed to assign permissions", error: err.message });
//   }
// };

// // ----------------------------
// // Assign roles to a user (tenant-aware)
// // ----------------------------
// export const assignRolesToUser = async (req, res) => {
//   try {
//     const { user_id, role_ids } = req.body;
//     if (!user_id || !role_ids?.length)
//       return res.status(400).json({ message: "user_id and role_ids required" });

//     // Filter only roles belonging to this tenant
//     const roles = await knex("master.roles").whereIn("id", role_ids).andWhere("tenant_id", req.tenant.id);
//     if (!roles.length) return res.status(404).json({ message: "No roles found for this tenant" });

//     const inserts = roles.map(r => ({ user_id, role_id: r.id }));
//     await knex("master.user_roles").insert(inserts).onConflict(['user_id','role_id']).ignore();

//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant.id,
//       action: "USER_ROLES_ASSIGNED",
//       resource: "user_roles",
//       resourceId: user_id,
//       metadata: { role_ids: roles.map(r => r.id) },
//       req,
//     });

//     return res.json({ message: "Roles assigned to user" });
//   } catch (err) {
//     console.error("Error assigning roles to user:", err);
//     return res.status(500).json({ message: "Failed to assign roles", error: err.message });
//   }
// };

// // ----------------------------
// // Get user roles & permissions (tenant-aware)
// // ----------------------------
// export const getUserRolesPermissions = async (req, res) => {
//   try {
//     const { user_id } = req.params;

//     const roles = await knex("master.user_roles as ur")
//       .join("master.roles as r", "ur.role_id", "r.id")
//       .where("ur.user_id", user_id)
//       .andWhere("r.tenant_id", req.tenant.id)
//       .select("r.id","r.name","r.role_level");

//     const permissions = await knex("master.role_permissions as rp")
//       .join("master.permissions as p","rp.permission_id","p.id")
//       .whereIn("rp.role_id", roles.map(r=>r.id))
//       .select("p.id","p.name");

//     return res.json({ roles, permissions });
//   } catch (err) {
//     console.error("Error fetching user roles & permissions:", err);
//     return res.status(500).json({ message: "Failed to fetch user roles & permissions", error: err.message });
//   }
// };

// src/modules/rbac/roles.controller.js
import * as rbacService from "./rbac.service.js";

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: "Role name required" });

    const role = await rbacService.createRole(
      { name, description },
      req.db,
      req.user?.id,
      req.tenant?.id
    );

    return res.status(201).json({ message: "Role created", role });
  } catch (err) {
    console.error("Error creating role:", err);
    return res.status(500).json({ message: err.message || "Failed to create role" });
  }
};

// Update role
export const updateRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { name, description } = req.body;
    const role = await rbacService.updateRole(
      roleId,
      { name, description },
      req.db,
      req.user?.id,
      req.tenant?.id
    );
    return res.json({ message: "Role updated", role });
  } catch (err) {
    console.error("Error updating role:", err);
    return res.status(500).json({ message: err.message || "Failed to update role" });
  }
};

// Delete role
export const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.params;
    await rbacService.deleteRole(roleId, req.db, req.user?.id, req.tenant?.id);
    return res.json({ message: "Role deleted" });
  } catch (err) {
    console.error("Error deleting role:", err);
    return res.status(500).json({ message: err.message || "Failed to delete role" });
  }
};

// List all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await rbacService.getRoles(req.db);
    return res.json({ roles });
  } catch (err) {
    console.error("Error fetching roles:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch roles" });
  }
};
