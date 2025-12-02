// import { RBACService } from './rbac.service.js';
// import { auditLog } from '../../utils/auditLogger.js';
// import { knex } from '../../db/knex.js';

// export const assignRolesToUser = async (req, res) => {
//   try {
//     const { user_id, role_ids } = req.body;
//     const result = await RBACService.assignRolesToUser(req.db, user_id, role_ids);

//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "USER_ROLES_ASSIGNED",
//       resource: "user_roles",
//       resourceId: user_id,
//       metadata: { role_ids },
//       req,
//     });

//     res.json({ message: 'Roles assigned to user', result });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to assign roles', error: err.message });
//   }
// };

// export const getUserRolesPermissions = async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     const data = await RBACService.getUserRolesPermissions(req.db, user_id);
//     res.json(data);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch user roles & permissions', error: err.message });
//   }
// };


// src/modules/rbac/userRole.controller.js
import * as rbacService from "./rbac.service.js";

// Assign roles to a user
export const assignRolesToUser = async (req, res) => {
  try {
    const { user_id, role_ids } = req.body;
    if (!user_id || !role_ids?.length) return res.status(400).json({ message: "user_id and role_ids required" });

    const result = await rbacService.assignRoles(
      user_id,
      role_ids,
      req.db,
      req.user?.id,
      req.tenant?.id
    );

    return res.json({ message: "Roles assigned to user", result });
  } catch (err) {
    console.error("Error assigning roles to user:", err);
    return res.status(500).json({ message: err.message || "Failed to assign roles" });
  }
};

// Get user roles & permissions
export const getUserRolesPermissions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await rbacService.getUserRolesPermissions(user_id, req.db);
    return res.json(data);
  } catch (err) {
    console.error("Error fetching user roles & permissions:", err);
    return res.status(500).json({ message: err.message || "Failed to fetch user roles & permissions" });
  }
};
