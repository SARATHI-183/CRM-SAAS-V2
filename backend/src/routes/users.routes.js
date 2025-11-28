// src/routes/users.routes.js
import express from "express";
import { getAllUsers, createUser, updateUser, deleteUser } from "../controllers/users.controller.js";
import requireTenant from "../middlewares/requireTenant.js";
import { requireRole } from "../middlewares/requireRole.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// All routes require tenant context
router.use(requireTenant);

// Only tenant_admin can create/update/delete users
router.get("/", getAllUsers);

router.post("/", requireRole(["tenant_admin"]), createUser);
router.put("/:id", requireRole(["tenant_admin"]), updateUser);
router.delete("/:id", requireRole(["tenant_admin"]), deleteUser);

export default router;
