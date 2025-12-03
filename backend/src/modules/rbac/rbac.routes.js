// // /modules/rbac/rbac.routes.js
// import express from "express";
// import * as RolesCtrl from "./roles.controller.js";
// import * as PermissionsCtrl from "./permission.controller.js";
// import * as RolePermCtrl from "./rolePermission.controller.js";
// import * as UserRoleCtrl from "./userRole.controller.js";

// const router = express.Router();

// /**
//  * -----------------------
//  * ROLES
//  * -----------------------
//  */
// router.post("/roles", RolesCtrl.createRole);          // Create a new role
// router.put("/roles/:roleId", RolesCtrl.updateRole);  // Update role
// router.delete("/roles/:roleId", RolesCtrl.deleteRole); // Delete role
// router.get("/roles", RolesCtrl.getRoles);            // List roles (optional)

// /**
//  * -----------------------
//  * PERMISSIONS
//  * -----------------------
//  */
// router.post("/permissions", PermissionsCtrl.createPermission);   // Create permission
// router.put("/permissions/:permissionId", PermissionsCtrl.updatePermission); // Update permission
// router.delete("/permissions/:permissionId", PermissionsCtrl.deletePermission); // Delete permission
// router.get("/permissions", PermissionsCtrl.getPermissions);       // List permissions

// /**
//  * -----------------------
//  * ROLE-PERMISSIONS
//  * -----------------------
//  */
// router.post("/role-permissions", RolePermCtrl.assignPermissionsToRole); // Assign permissions to role
// router.get("/role-permissions/:roleId", RolePermCtrl.getRolePermissions); // Get role permissions

// /**
//  * -----------------------
//  * USER-ROLES
//  * -----------------------
//  */
// router.post("/user-roles", UserRoleCtrl.assignRolesToUser);        // Assign roles to user
// router.get("/user-roles/:user_id", UserRoleCtrl.getUserRolesPermissions); // Get user roles & permissions

// export default router;

// /modules/rbac/rbac.routes.js
import express from "express";
import { requireRole } from "../../middlewares/requireRole.js";
import * as RolesCtrl from "./roles.controller.js";
import * as PermissionsCtrl from "./permission.controller.js";
import * as RolePermCtrl from "./rolePermission.controller.js";
import * as UserRoleCtrl from "./userRole.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = express.Router();

// /**
//  * -----------------------
//  * ROLES
//  * -----------------------
//  */
// // Only tenant_admin can create, update, delete roles
// router.post("/roles", requireRole(["tenant_admin"]), RolesCtrl.createRole);
// router.put("/roles/:roleId", requireRole(["tenant_admin"]), RolesCtrl.updateRole);
// router.delete("/roles/:roleId", requireRole(["tenant_admin"]), RolesCtrl.deleteRole);

// // Tenant_admin and manager can view roles
// router.get("/roles", requireRole(["tenant_admin", "manager"]), RolesCtrl.getRoles);

// /**
//  * -----------------------
//  * PERMISSIONS
//  * -----------------------
//  */
// // Only tenant_admin can create, update, delete permissions
// router.post("/permissions", requireRole(["tenant_admin"]), PermissionsCtrl.createPermission);
// router.put("/permissions/:permissionId", requireRole(["tenant_admin"]), PermissionsCtrl.updatePermission);
// router.delete("/permissions/:permissionId", requireRole(["tenant_admin"]), PermissionsCtrl.deletePermission);

// // Any role with permissions.view can list permissions
// router.get("/permissions", requireRole([], ["permissions.view"]), PermissionsCtrl.getPermissions);


// // Assign or update role permissions only tenant_admin
// router.post("/role-permissions", requireRole(["tenant_admin"]), RolePermCtrl.assignPermissionsToRole);
// router.get("/role-permissions/:roleId", requireRole(["tenant_admin", "manager"]), RolePermCtrl.getRolePermissions);



// // Assign roles to user only tenant_admin
// router.post("/user-roles", requireRole(["tenant_admin"]), UserRoleCtrl.assignRolesToUser);

// // Get user roles & permissions: tenant_admin or the user themselves
// router.get(
//   "/user-roles/:user_id",
//   requireRole(["tenant_admin"], ["view.own.roles"]), // optional fine-grained permission for self-view
//   UserRoleCtrl.getUserRolesPermissions
// );

// export default router;

// -----------------------
// ROLES
// -----------------------

// Only tenant_admin can create, update, delete roles (strict)
router.post("/roles", requireRole(["tenant_admin"], [], true), RolesCtrl.createRole);
router.put("/roles/:roleId", requireRole(["tenant_admin"], [], true), RolesCtrl.updateRole);
router.delete("/roles/:roleId", requireRole(["tenant_admin"], [], true), RolesCtrl.deleteRole);

// Tenant_admin and manager can view roles (flexible)
router.get("/roles", requireRole(["tenant_admin", "manager"], [], false), RolesCtrl.getRoles);


// -----------------------
// PERMISSIONS
// -----------------------

// Only tenant_admin can create, update, delete permissions (strict)
router.post("/permissions", requireRole(["tenant_admin"], [], true), PermissionsCtrl.createPermission);
router.put("/permissions/:permissionId", requireRole(["tenant_admin"], [], true), PermissionsCtrl.updatePermission);
router.delete("/permissions/:permissionId", requireRole(["tenant_admin"], [], true), PermissionsCtrl.deletePermission);

// Any role with permissions.view can list permissions (flexible)
router.get("/permissions", requireRole([], ["permissions.view"], false), PermissionsCtrl.getPermissions);


// -----------------------
// ROLE-PERMISSIONS
// -----------------------

// Assign or update role permissions only tenant_admin (strict)
router.post("/role-permissions", requireRole(["tenant_admin"], [], true), RolePermCtrl.assignPermissionsToRole);

// Tenant_admin and manager can view role permissions (flexible)
router.get("/role-permissions/:roleId", requireRole(["tenant_admin", "manager"], [], false), RolePermCtrl.getRolePermissions);


// -----------------------
// USER-ROLES
// -----------------------

// Assign roles to user only tenant_admin (strict)
router.post("/user-roles", requireRole(["tenant_admin"], [], true), UserRoleCtrl.assignRolesToUser);

// Get user roles & permissions: tenant_admin or the user themselves (flexible)
router.get(
  "/user-roles/:user_id",
  requireRole(["tenant_admin"], ["view.own.roles"], false),
  UserRoleCtrl.getUserRolesPermissions
);

export default router;
