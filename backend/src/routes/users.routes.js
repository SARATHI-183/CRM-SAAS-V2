// src/routes/users.routes.js
import express from "express";
import { getAllUsers, createUser, updateUser, softDeleteUser, hardDeleteUser, getSoftDeletedUsers, restoreUser, getSingleUser} from "../controllers/users.controller.js";
import requireTenant from "../middlewares/requireTenant.js";
import { requireRole } from "../middlewares/requireRole.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// All routes require tenant context
router.use(requireTenant);


// Only tenant_admin can create/update/delete users
router.get("/", requireRole(["tenant_admin", "sales_admin", "sales_rep"]), getAllUsers);

router.get("/deleted", requireRole("tenant_admin"), getSoftDeletedUsers);

router.post("/", requireRole(["tenant_admin"]), createUser);

router.put("/:id", requireRole(["tenant_admin"]), updateUser);

router.get("/:id", requireRole(["tenant_admin", "sales_admin", "sales_rep"]), getSingleUser);

router.put("/:id/restore", requireRole("tenant_admin"), restoreUser);

router.delete("/:id", requireRole(["tenant_admin"]), softDeleteUser);

router.delete("/:id/hard", requireRole(["tenant_admin"]), hardDeleteUser);

export default router;
