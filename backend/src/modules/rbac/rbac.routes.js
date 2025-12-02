// /modules/rbac/rbac.routes.js
import express from "express";
import * as RolesCtrl from "./roles.controller.js";
import * as PermissionsCtrl from "./permission.controller.js";
import * as RolePermCtrl from "./rolePermission.controller.js";
import * as UserRoleCtrl from "./userRole.controller.js";

const router = express.Router();

/**
 * -----------------------
 * ROLES
 * -----------------------
 */
router.post("/roles", RolesCtrl.createRole);          // Create a new role
router.put("/roles/:roleId", RolesCtrl.updateRole);  // Update role
router.delete("/roles/:roleId", RolesCtrl.deleteRole); // Delete role
router.get("/roles", RolesCtrl.getRoles);            // List roles (optional)

/**
 * -----------------------
 * PERMISSIONS
 * -----------------------
 */
router.post("/permissions", PermissionsCtrl.createPermission);   // Create permission
router.put("/permissions/:permissionId", PermissionsCtrl.updatePermission); // Update permission
router.delete("/permissions/:permissionId", PermissionsCtrl.deletePermission); // Delete permission
router.get("/permissions", PermissionsCtrl.getPermissions);       // List permissions

/**
 * -----------------------
 * ROLE-PERMISSIONS
 * -----------------------
 */
router.post("/role-permissions", RolePermCtrl.assignPermissionsToRole); // Assign permissions to role
router.get("/role-permissions/:roleId", RolePermCtrl.getRolePermissions); // Get role permissions

/**
 * -----------------------
 * USER-ROLES
 * -----------------------
 */
router.post("/user-roles", UserRoleCtrl.assignRolesToUser);        // Assign roles to user
router.get("/user-roles/:user_id", UserRoleCtrl.getUserRolesPermissions); // Get user roles & permissions

export default router;
