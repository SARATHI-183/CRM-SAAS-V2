
// // Checks if user has one of the required roles or permissions
// export function requireRole(requiredRoles = [], requiredPermissions = []) {
//   return async (req, res, next) => {
//     try {
//       const userRoles = req.user?.roles || []; // e.g., ["Tenant Admin", "Employee"]
//       const userPermissions = req.user?.permissions || []; // e.g., ["CREATE_USER", "UPDATE_ROLE"]

//       // Check roles
//       if (requiredRoles.length && !userRoles.some(r => requiredRoles.includes(r))) {
//         return res.status(403).json({ message: "Access denied: insufficient role" });
//       }
//       // Check permissions
//       if (requiredPermissions.length && !userPermissions.some(p => requiredPermissions.includes(p))) {
//         return res.status(403).json({ message: "Access denied: insufficient permission" });
//       }

//       next();
//     } catch (err) {
//       console.error("requireRole middleware error:", err);
//       res.status(500).json({ message: "Failed to verify role/permission" });
//     }
//   };
// }


// /middlewares/requireRole.js
import { getUserRoles, getUserPermissions } from "../modules/rbac/rbac.service.js";

/**
 * Middleware to check if user has required roles or permissions dynamically
 * @param {Array} requiredRoles - Roles allowed to access the route
 * @param {Array} requiredPermissions - Permissions allowed to access the route
 */
// export function requireRole(requiredRoles = [], requiredPermissions = []) {
//   return async (req, res, next) => {
//     try {
//       // Ensure tenant and user are available
//       if (!req.user || !req.tenant || !req.db) {
//         return res.status(500).json({ message: "Tenant or user not found in request" });
//       }

//       const tenantDb = req.db; // dynamic tenant DB connection (set by requireTenant middleware)
//       const userId = req.user.id;

//       // Fetch roles and permissions for this user from tenant DB
//       const userRolesRaw = await getUserRoles(tenantDb, userId); // [{id, name}]
//       const userRoles = userRolesRaw.map(r => r.name);

//       const userPermissions = await getUserPermissions(tenantDb, userId); // ["leads.view", "deals.create"]

//       // Check roles
//       // if (requiredRoles.length && !userRoles.some(role => requiredRoles.includes(role))) {
//       //   return res.status(403).json({
//       //     message: "Access denied: insufficient role",
//       //     userRoles,
//       //   });
//       // }

//       // // Check permissions
//       // if (requiredPermissions.length && !userPermissions.some(perm => requiredPermissions.includes(perm))) {
//       //   return res.status(403).json({
//       //     message: "Access denied: insufficient permission",
//       //     userPermissions,
//       //   });
//       // }

//       // // Attach roles and permissions to req.user for later use in controllers
//       // req.user.roles = userRoles;
//       // req.user.permissions = userPermissions;

//       // next();

//         let roleMatch = false;
//         let permMatch = false;

//         if (requiredRoles.length) {
//           roleMatch = userRoles.some(r => requiredRoles.includes(r));
//         }

//         if (requiredPermissions.length) {
//           permMatch = userPermissions.some(p => requiredPermissions.includes(p));
//         }

//         // Allow if:
//         // 1. No roles OR role matches
//         // 2. No permissions OR permission matches
//         if (
//           (requiredRoles.length === 0 || roleMatch) ||
//           (requiredPermissions.length === 0 || permMatch)
//         ) {
//           req.user.roles = userRoles;
//           req.user.permissions = userPermissions;
//           return next();
//         }
//     } catch (err) {
//       console.error("requireRole middleware error:", err);
//       return res.status(500).json({ message: "Failed to verify role/permission", error: err.message });
//     }
//   };
// }

export function requireRole(requiredRoles = [], requiredPermissions = [], strict = false) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.tenant || !req.db) {
        return res.status(500).json({ message: "Tenant or user not found in request" });
      }

      const tenantDb = req.db;
      const userId = req.user.id;

      const userRolesRaw = await getUserRoles(tenantDb, userId);
      const userRoles = userRolesRaw.map(r => r.name);

      const userPermissions = await getUserPermissions(tenantDb, userId);

      const roleMatch = requiredRoles.length ? userRoles.some(r => requiredRoles.includes(r)) : false;
      const permMatch = requiredPermissions.length ? userPermissions.some(p => requiredPermissions.includes(p)) : false;

      if (strict) {
        // Strict: must satisfy BOTH role and permission if both provided
        if (requiredRoles.length && !roleMatch) {
          return res.status(403).json({ message: "Access denied: insufficient role", userRoles });
        }
        if (requiredPermissions.length && !permMatch) {
          return res.status(403).json({ message: "Access denied: insufficient permission", userPermissions });
        }
      } else {
        // Flexible: role OR permission
        if (!roleMatch && !permMatch) {
          return res.status(403).json({ message: "Access denied: insufficient role or permission", userRoles, userPermissions });
        }
      }

      req.user.roles = userRoles;
      req.user.permissions = userPermissions;
      return next();
    } catch (err) {
      console.error("requireRole middleware error:", err);
      return res.status(500).json({ message: "Failed to verify role/permission", error: err.message });
    }
  };
}
