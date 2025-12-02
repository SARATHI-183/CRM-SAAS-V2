// src/modules/rbac/rolePermission.controller.js
import * as rbacService from "./rbac.service.js";

// Assign permissions to a role
export const assignPermissionsToRole = async (req, res) => {
  try {
    const { role_id, permission_ids } = req.body;
    if (!role_id || !permission_ids?.length) return res.status(400).json({ message: "role_id and permission_ids required" });

    const result = await rbacService.assignPermissions(
      role_id,
      permission_ids,
      req.db,
      req.user?.id,
      req.tenant?.id
    );

    return res.json({ message: "Permissions assigned to role", result });
  } catch (err) {
    console.error("Error assigning permissions:", err);
    return res.status(500).json({ message: err.message || "Failed to assign permissions" });
  }
};

// Get role permissions
export const getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const permissions = await rbacService.getRolePermissions(roleId, req.db);
    return res.json({ permissions });
  } catch (err) {
    console.error("Error fetching role permissions:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch role permissions" });
  }
};
