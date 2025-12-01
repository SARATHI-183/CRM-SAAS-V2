// middlewares/requirePermission.js
import { checkUserPermission } from "../services/roles.service.js";

export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const user = req.user; // tenant user from auth middleware
      if (!user) return res.status(401).json({ message: "Unauthorized" });

      const allowed = await checkUserPermission(user, permission);
      if (!allowed) return res.status(403).json({ message: "Forbidden" });

      next();
    } catch (err) {
      console.error("Permission check error:", err);
      res.status(500).json({ message: "Permission check failed" });
    }
  };
}
