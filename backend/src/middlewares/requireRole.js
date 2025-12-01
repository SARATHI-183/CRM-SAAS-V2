
// Checks if user has one of the required roles or permissions
export function requireRole(requiredRoles = [], requiredPermissions = []) {
  return async (req, res, next) => {
    try {
      const userRoles = req.user?.roles || []; // e.g., ["Tenant Admin", "Employee"]
      const userPermissions = req.user?.permissions || []; // e.g., ["CREATE_USER", "UPDATE_ROLE"]

      // Check roles
      if (requiredRoles.length && !userRoles.some(r => requiredRoles.includes(r))) {
        return res.status(403).json({ message: "Access denied: insufficient role" });
      }
      // Check permissions
      if (requiredPermissions.length && !userPermissions.some(p => requiredPermissions.includes(p))) {
        return res.status(403).json({ message: "Access denied: insufficient permission" });
      }

      next();
    } catch (err) {
      console.error("requireRole middleware error:", err);
      res.status(500).json({ message: "Failed to verify role/permission" });
    }
  };
}
