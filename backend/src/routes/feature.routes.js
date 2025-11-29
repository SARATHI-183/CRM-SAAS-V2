import express from "express";
import { requireFeature } from "../middlewares/featureControl.js";
import { isFeatureEnabled } from "../services/featureService.js";

const router = express.Router();

// Example: Tenant wants to create a custom module
router.post("/custom-modules", requireFeature(["custom_modules"]), async (req, res) => {
  const tenantId = req.tenant.id;
  
  const enabled = await isFeatureEnabled(tenantId, "custom_modules");
  if (!enabled) return res.status(403).json({ message: "Custom Modules not allowed" });

  // Proceed to create module
  // ...
  res.json({ message: "Module created successfully" });
});

export default router;
