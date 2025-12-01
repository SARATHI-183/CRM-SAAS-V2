import express from "express";
import * as rolesController from "../controllers/roles.controller.js";
import { requireRole } from "../middlewares/requireRole.js";

const router = express.Router();

router.post("/", requireRole(["superadmin"]), rolesController.createRole); 

router.post("/assign-permissions", requireRole(["superadmin"]), rolesController.assignPermissions);

router.post("/assign-roles", requireRole(["superadmin", "tenant_admin"]), rolesController.assignRolesToUser);
    
router.get("/user/:user_id", requireRole(["superadmin", "tenant_admin"]), rolesController.getUserRolesPermissions);

export default router;
