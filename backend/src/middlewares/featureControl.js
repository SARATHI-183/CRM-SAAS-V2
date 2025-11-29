// middlewares/featureControl.js
import { knex } from "../knex.js";

/**
 * Middleware to enforce feature/module access
 * @param {string[]} requiredFeatures - List of feature_keys required for this route
 */
export const requireFeature = (requiredFeatures = []) => {
  return async (req, res, next) => {
    try {
      const tenantId = req.tenant.id; // Set from tenantResolver
      const userRole = req.user.role;

      // Superadmin bypass
      if (userRole === "super_admin") return next();

      // Load features enabled for this tenant
      const enabledFeatures = await knex("master.tenant_feature_overrides")
        .where("tenant_id", tenantId)
        .andWhere("is_enabled", true)
        .pluck("feature_id");

      const featureKeys = await knex("master.features")
        .whereIn("id", enabledFeatures)
        .pluck("feature_key");

      // Check if all required features are enabled
      const hasAccess = requiredFeatures.every((f) => featureKeys.includes(f));

      if (!hasAccess) {
        return res.status(403).json({ message: "Feature not enabled for this tenant" });
      }

      next();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
