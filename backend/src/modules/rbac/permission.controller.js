// // /modules/rbac/permissions.controller.js
// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../../db/knex.js";
// import { auditLog } from "../../utils/auditLogger.js";
// import { safePermissionData } from "../../utils/safeData.js";

// /**
//  * Create a new permission (tenant-aware)
//  */
// export const createPermission = async (req, res) => {
//   try {
//     const { key, module, description } = req.body;

//     if (!key || !module)
//       return res.status(400).json({ message: "Permission key and module are required" });

//     // Check if permission already exists in tenant
//     const existing = await req.db("permissions").where({ key }).first();
//     if (existing) return res.status(400).json({ message: "Permission key already exists" });

//     const id = uuidv4();
//     const [permission] = await req.db("permissions")
//       .insert({
//         id,
//         key,
//         module,
//         description,
//         created_at: new Date(),
//         updated_at: new Date(),
//       })
//       .returning("*");

//     // Audit log
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "PERMISSION_CREATED",
//       resource: "permission",
//       resourceId: id,
//       metadata: permission,
//       req,
//     });

//     return res.status(201).json({ message: "Permission created", permission: safePermissionData(permission) });
//   } catch (err) {
//     console.error("Error creating permission:", err);
//     return res.status(500).json({ message: "Failed to create permission", error: err.message });
//   }
// };

// /**
//  * Update an existing permission
//  */
// export const updatePermission = async (req, res) => {
//   try {
//     const { permissionId } = req.params;
//     const { key, module, description } = req.body;

//     const oldPermission = await req.db("permissions").where({ id: permissionId }).first();
//     if (!oldPermission) return res.status(404).json({ message: "Permission not found" });

//     const updates = {};
//     if (key) updates.key = key;
//     if (module) updates.module = module;
//     if (description) updates.description = description;
//     updates.updated_at = new Date();

//     const [updatedPermission] = await req.db("permissions").where({ id: permissionId }).update(updates).returning("*");

//     // Audit log
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "PERMISSION_UPDATED",
//       resource: "permission",
//       resourceId: permissionId,
//       metadata: {
//         old_values: oldPermission,
//         new_values: updatedPermission,
//       },
//       req,
//     });

//     return res.json({ message: "Permission updated", permission: safePermissionData(updatedPermission) });
//   } catch (err) {
//     console.error("Error updating permission:", err);
//     return res.status(500).json({ message: "Failed to update permission", error: err.message });
//   }
// };

// /**
//  * Delete a permission
//  */
// export const deletePermission = async (req, res) => {
//   try {
//     const { permissionId } = req.params;

//     const permission = await req.db("permissions").where({ id: permissionId }).first();
//     if (!permission) return res.status(404).json({ message: "Permission not found" });

//     await req.db("permissions").where({ id: permissionId }).del();

//     // Audit log
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "PERMISSION_DELETED",
//       resource: "permission",
//       resourceId: permissionId,
//       metadata: permission,
//       req,
//     });

//     return res.json({ message: "Permission deleted", permission: safePermissionData(permission) });
//   } catch (err) {
//     console.error("Error deleting permission:", err);
//     return res.status(500).json({ message: "Failed to delete permission", error: err.message });
//   }
// };

// /**
//  * Get all permissions (optionally filter by module)
//  */
// export const getPermissions = async (req, res) => {
//   try {
//     const { module } = req.query;

//     let query = req.db("permissions").select("*");
//     if (module) query = query.where({ module });

//     const permissions = await query;

//     return res.json({ data: permissions.map(safePermissionData) });
//   } catch (err) {
//     console.error("Error fetching permissions:", err);
//     return res.status(500).json({ message: "Failed to fetch permissions", error: err.message });
//   }
// };


// src/modules/rbac/permissions.controller.js
import * as rbacService from "./rbac.service.js";

// Create a new permission
export const createPermission = async (req, res) => {
  try {
    const { key, module, description } = req.body;
    if (!key || !module) return res.status(400).json({ message: "key and module required" });

    const permission = await rbacService.createPermission(
      { key, module, description },
      req.db,
      req.user?.id,
      req.tenant?.id
    );

    return res.status(201).json({ message: "Permission created", permission });
  } catch (err) {
    console.error("Error creating permission:", err);
    return res.status(500).json({ message: err.message || "Failed to create permission" });
  }
};

// Update permission
export const updatePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    const { key, module, description } = req.body;

    const permission = await rbacService.updatePermission(
      permissionId,
      { key, module, description },
      req.db,
      req.user?.id,
      req.tenant?.id
    );

    return res.json({ message: "Permission updated", permission });
  } catch (err) {
    console.error("Error updating permission:", err);
    return res.status(500).json({ message: err.message || "Failed to update permission" });
  }
};

// Delete permission
export const deletePermission = async (req, res) => {
  try {
    const { permissionId } = req.params;
    await rbacService.deletePermission(permissionId, req.db, req.user?.id, req.tenant?.id);
    return res.json({ message: "Permission deleted" });
  } catch (err) {
    console.error("Error deleting permission:", err);
    return res.status(500).json({ message: err.message || "Failed to delete permission" });
  }
};

// List all permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await rbacService.getPermissions(req.db);
    return res.json({ permissions });
  } catch (err) {
    console.error("Error fetching permissions:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch permissions" });
  }
};
