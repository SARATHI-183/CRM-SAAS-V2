
// // src/controllers/users.controller.js
// import bcrypt from "bcrypt";
// import { v4 as uuidv4 } from "uuid";
// import { knex } from "../db/knex.js"; // master DB for audit logs
// import { auditLog } from "../utils/auditLogger.js";

// // ----------------------------
// // Helper: safe user data for response & audit
// // ----------------------------
// const safeUserData = (user) => {
//   if (!user) return {};
//   const { id, name, email, role, is_active, created_at, updated_at } = user;
//   return { id, name, email, role, is_active, created_at, updated_at };
// };

// async function getRoleIdByName(knex, roleName) {
//   const role = await knex("master.roles").where({ name: roleName }).first();
//   if (!role) throw new Error(`Role not found: ${roleName}`);
//   return role.id;
// }

// // ----------------------------
// // Get All Users (Tenant-level)
// // ----------------------------
// // ----------------------------
// // Get All ACTIVE Users Only
// // ----------------------------
// // controllers/userController.js

// export async function getSingleUser(req, res) {
//   try {
//     const { id } = req.params;

//     const user = await req.db
//       .table("users")
//       .where({ id, is_active: true })
//       .first();

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     return res.json({ user: safeUserData(user) });
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     return res.status(500).json({ message: "Failed to fetch user", error: err.message });
//   }
// }

// export const getAllUsers = async (req, res) => {
//   try {
//     const { search, role, page = 1, limit = 10 } = req.query;

//     const query = req.db.table("users").where({ is_active: true });

//     // 1️⃣ Filter by role if provided
//     if (role) {
//       query.andWhere("role", role);
//     }

//     // 2️⃣ Search by name or email if provided
//     if (search) {
//       query.andWhere((qb) => {
//         qb.where("name", "ilike", `%${search}%`)
//           .orWhere("email", "ilike", `%${search}%`);
//       });
//     }

//     // 3️⃣ Get total count for pagination info
//     const total = await query.clone().count("* as count").first();
//     const totalCount = parseInt(total.count);

//     // 4️⃣ Pagination
//     const offset = (parseInt(page) - 1) * parseInt(limit);
//     const users = await query
//       .clone()
//       .offset(offset)
//       .limit(parseInt(limit))
//       .select("id", "name", "email", "role", "is_active", "created_at", "updated_at");

//     return res.json({
//       data: users.map(safeUserData),
//       pagination: {
//         total: totalCount,
//         page: parseInt(page),
//         limit: parseInt(limit),
//         totalPages: Math.ceil(totalCount / parseInt(limit)),
//       },
//     });
//   } catch (err) {
//     console.error("Error fetching users:", err);
//     return res.status(500).json({
//       message: "Failed to fetch users",
//       error: err.message,
//     });
//   }
// };


// // export const getAllUsers = async (req, res) => {
// //   try {
// //     const users = await req.db
// //       .table("users")
// //       .where({ is_active: true }) // ← hides soft-deleted users
// //       .select("id", "name", "email", "role", "is_active", "created_at", "updated_at");

// //     return res.json({ data: users.map(safeUserData) });
// //   } catch (err) {
// //     console.error("Error fetching users:", err);
// //     return res.status(500).json({
// //       message: "Failed to fetch users",
// //       error: err.message,
// //     });
// //   }
// // };


// // ----------------------------
// // Create User
// // ----------------------------

// // export const createUser = async (req, res) => {
// //   try {
// //     const { name, email, password, role } = req.body;
// //     const tenantSchema = req.tenant.schema_name;

// //     if (!name || !email || !password) {
// //       return res.status(400).json({ message: "name, email, and password are required" });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);
// //     const userId = uuidv4();

// //     // Insert user into tenant DB
// //     const [newUser] = await req.db
// //       .table("users")
// //       .insert({
// //         id: userId,
// //         name,
// //         email,
// //         password: hashedPassword,
// //         role: role || "employee",
// //         is_active: true,
// //         created_at: new Date(),
// //         updated_at: new Date(),
// //       })
// //       .returning("*");

// //     // Insert role in master DB
// //     const roleId = await getRoleIdByName(knex, role);

// //     await knex.withSchema("master")
// //       .table("user_roles")
// //       .insert({
// //         user_id: userId,
// //         role_id: roleId,
// //       });

// //     // Audit log
// //     await auditLog(knex, {
// //       userId: req.user?.id,
// //       tenantId: req.tenant?.id,
// //       action: "USER_CREATED",
// //       resource: "user",
// //       resourceId: userId,
// //       metadata: safeUserData(newUser),
// //       req,
// //     });

// //     return res.status(201).json({ message: "User created", user: safeUserData(newUser) });

// //   } catch (err) {
// //     console.error("Error creating user:", err);
// //     return res.status(500).json({ message: "Failed to create user", error: err.message });
// //   }
// // };
// export const createUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;
//     const tenantSchema = req.tenant.schema_name;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "name, email, and password are required" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const userId = uuidv4();

//     // -------------------------
//     // Insert user into tenant DB
//     // -------------------------
//     const [newUser] = await req.db
//       .table("users")
//       .insert({
//         id: userId,
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "Employee",
//         is_active: true,
//         created_at: new Date(),
//         updated_at: new Date(),
//       })
//       .returning("*");

//     // -------------------------
//     // Resolve Role ID in master DB
//     // -------------------------
//     async function getRoleIdByName(knex, roleName, tenantId) {
//       // Check tenant-specific role first
//       let roleRecord = await knex("master.roles")
//         .where({ name: roleName, tenant_id: tenantId })
//         .first();

//       // Fallback to global role
//       if (!roleRecord) {
//         roleRecord = await knex("master.roles")
//           .where({ name: roleName, tenant_id: null })
//           .first();
//       }

//       if (!roleRecord) throw new Error(`Role not found: ${roleName}`);
//       return roleRecord.id;
//     }

//     const roleId = await getRoleIdByName(knex, role || "Employee", req.tenant.id);

//     // -------------------------
//     // Insert mapping into user_roles
//     // -------------------------
//     await knex.withSchema("master")
//       .table("user_roles")
//       .insert({
//         user_id: userId,
//         role_id: roleId,
//       });

//     // -------------------------
//     // Audit log
//     // -------------------------
//     await auditLog(knex, {
//       userId: req.user?.id,       // tenant user performing the action
//       tenantId: req.tenant?.id,
//       action: "USER_CREATED",
//       resource: "user",
//       resourceId: userId,
//       metadata: safeUserData(newUser),
//       req,
//     });

//     return res.status(201).json({ message: "User created", user: safeUserData(newUser) });

//   } catch (err) {
//     console.error("Error creating user:", err);
//     return res.status(500).json({ message: "Failed to create user", error: err.message });
//   }
// };


// // ----------------------------
// // Update User
// // ----------------------------
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, password, role, is_active } = req.body;

//     const oldUser = await req.db.table("users").where({ id }).first();
//     if (!oldUser) return res.status(404).json({ message: "User not found" });

//     const updates = {};
//     if (name) updates.name = name;
//     if (email) updates.email = email;
//     if (password) updates.password = await bcrypt.hash(password, 10);
//     if (role) updates.role = role;
//     if (typeof is_active === "boolean") updates.is_active = is_active;
//     updates.updated_at = new Date();

//     const [updatedUser] = await req.db.table("users").where({ id }).update(updates).returning("*");

//     // --- Audit log ---
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "USER_UPDATED",
//       resource: "user",
//       resourceId: id,
//       metadata: {
//         old_values: safeUserData(oldUser),
//         new_values: safeUserData(updatedUser),
//       },
//       req,
//     });

//     return res.json({ message: "User updated", user: safeUserData(updatedUser) });
//   } catch (err) {
//     console.error("Error updating user:", err);
//     return res.status(500).json({ message: "Failed to update user", error: err.message });
//   }
// };

// // ----------------------------
// // Delete User
// // ----------------------------

// // ----------------------------
// // Soft Delete User
// // ----------------------------
// export const softDeleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await req.db.table("users").where({ id }).first();
//     if (!user) return res.status(404).json({ message: "User not found" });

//     // Soft delete: set is_active = false
//     const updatedUser = await req.db.table("users")
//       .where({ id })
//       .update({ is_active: false, updated_at: new Date() })
//       .returning("*")
//       .then(([u]) => u);

//     // Audit log in master DB
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "USER_SOFT_DELETED",
//       resource: "user",
//       resourceId: id,
//       metadata: {
//         old_values: safeUserData(user),
//         new_values: safeUserData(updatedUser),
//       },
//       req,
//     });

//     return res.json({ message: "User soft deleted", user: safeUserData(updatedUser) });
//   } catch (err) {
//     console.error("Error soft deleting user:", err);
//     return res.status(500).json({ message: "Failed to soft delete user", error: err.message });
//   }
// };


// //hard delete
// export const hardDeleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await req.db.table("users").where({ id }).first();
//     if (!user) return res.status(404).json({ message: "User not found" });

//     await req.db.table("users").where({ id }).del();

//     // --- Audit log ---
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "USER_DELETED",
//       resource: "user",
//       resourceId: id,
//       metadata: safeUserData(user),
//       req,
//     });

//     return res.json({ message: "User deleted", user: safeUserData(user) });
//   } catch (err) {
//     console.error("Error deleting user:", err);
//     return res.status(500).json({ message: "Failed to delete user", error: err.message });
//   }
// };


// // ----------------------------
// // Get Soft-Deleted Users
// // ----------------------------
// export const getSoftDeletedUsers = async (req, res) => {
//   try {
//     const users = await req.db
//       .table("users")
//       .where({ is_active: false })
//       .select("id", "name", "email", "role", "is_active", "created_at", "updated_at");

//     return res.json({ data: users.map(safeUserData) });
//   } catch (err) {
//     console.error("Error fetching deleted users:", err);
//     return res.status(500).json({
//       message: "Failed to fetch deleted users",
//       error: err.message,
//     });
//   }
// };


// // ----------------------------
// // Restore Soft-Deleted User
// // ----------------------------
// export const restoreUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await req.db.table("users").where({ id }).first();
//     if (!user) return res.status(404).json({ message: "User not found" });

//     if (user.is_active === true)
//       return res.status(400).json({ message: "User is already active" });

//     await req.db.table("users")
//       .where({ id })
//       .update({ is_active: true, updated_at: new Date() });

//     // Audit Log
//     await auditLog(knex, {
//       userId: req.user?.id,
//       tenantId: req.tenant?.id,
//       action: "USER_RESTORED",
//       resource: "user",
//       resourceId: id,
//       metadata: safeUserData(user),
//       req,
//     });

//     return res.json({ message: "User restored", user: safeUserData(user) });
//   } catch (err) {
//     console.error("Error restoring user:", err);
//     return res.status(500).json({
//       message: "Failed to restore user",
//       error: err.message,
//     });
//   }
// };



// src/controllers/users.controller.js
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js"; // master DB for audit logs
import { auditLog } from "../utils/auditLogger.js";

// ----------------------------
// Helper: sanitize user data for response & audit
// ----------------------------
const safeUserData = (user) => {
  if (!user) return {};
  const { id, name, email, role, is_active, created_at, updated_at } = user;
  return { id, name, email, role, is_active, created_at, updated_at };
};

// ----------------------------
// Helper: get Role ID (tenant-specific first, fallback global)
// ----------------------------
async function resolveRoleId(roleName, tenantId) {
  let roleRecord = await knex("master.roles")
    .where({ name: roleName, tenant_id: tenantId })
    .first();

  if (!roleRecord) {
    roleRecord = await knex("master.roles")
      .where({ name: roleName, tenant_id: null })
      .first();
  }

  if (!roleRecord) throw new Error(`Role not found: ${roleName}`);
  return roleRecord.id;
}

// ----------------------------
// GET SINGLE USER
// ----------------------------
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db.table("users").where({ id, is_active: true }).first();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({ user: safeUserData(user) });
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

// ----------------------------
// GET ALL USERS (search, role filter, pagination)
// ----------------------------
export const getAllUsers = async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;
    const query = req.db.table("users").where({ is_active: true });

    if (role) query.andWhere("role", role);
    if (search) {
      query.andWhere((qb) => {
        qb.where("name", "ilike", `%${search}%`).orWhere("email", "ilike", `%${search}%`);
      });
    }

    const total = await query.clone().count("* as count").first();
    const totalCount = parseInt(total.count);
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = await query
      .clone()
      .offset(offset)
      .limit(parseInt(limit))
      .select("id", "name", "email", "role", "is_active", "created_at", "updated_at");

    return res.json({
      data: users.map(safeUserData),
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

// ----------------------------
// CREATE USER
// ----------------------------
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "name, email, and password are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const [newUser] = await req.db.table("users")
      .insert({
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: role || "Employee",
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    const roleId = await resolveRoleId(role || "Employee", req.tenant.id);

    await knex.withSchema("master").table("user_roles").insert({
      user_id: userId,
      role_id: roleId,
    });

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_CREATED",
      resource: "user",
      resourceId: userId,
      metadata: safeUserData(newUser),
      req,
    });

    return res.status(201).json({ message: "User created", user: safeUserData(newUser) });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

// ----------------------------
// UPDATE USER
// ----------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, is_active } = req.body;

    const oldUser = await req.db.table("users").where({ id }).first();
    if (!oldUser) return res.status(404).json({ message: "User not found" });

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role) updates.role = role;
    if (typeof is_active === "boolean") updates.is_active = is_active;
    updates.updated_at = new Date();

    const [updatedUser] = await req.db.table("users").where({ id }).update(updates).returning("*");

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_UPDATED",
      resource: "user",
      resourceId: id,
      metadata: {
        old_values: safeUserData(oldUser),
        new_values: safeUserData(updatedUser),
      },
      req,
    });

    return res.json({ message: "User updated", user: safeUserData(updatedUser) });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

// ----------------------------
// SOFT DELETE USER
// ----------------------------
export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db.table("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const [updatedUser] = await req.db.table("users")
      .where({ id })
      .update({ is_active: false, updated_at: new Date() })
      .returning("*");

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_SOFT_DELETED",
      resource: "user",
      resourceId: id,
      metadata: { old_values: safeUserData(user), new_values: safeUserData(updatedUser) },
      req,
    });

    return res.json({ message: "User soft deleted", user: safeUserData(updatedUser) });
  } catch (err) {
    console.error("Error soft deleting user:", err);
    return res.status(500).json({ message: "Failed to soft delete user", error: err.message });
  }
};

// ----------------------------
// HARD DELETE USER
// ----------------------------
export const hardDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db.table("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    await req.db.table("users").where({ id }).del();

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_DELETED",
      resource: "user",
      resourceId: id,
      metadata: safeUserData(user),
      req,
    });

    return res.json({ message: "User deleted", user: safeUserData(user) });
  } catch (err) {
    console.error("Error hard deleting user:", err);
    return res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};

// ----------------------------
// GET SOFT-DELETED USERS
// ----------------------------
export const getSoftDeletedUsers = async (req, res) => {
  try {
    const users = await req.db.table("users").where({ is_active: false });
    return res.json({ data: users.map(safeUserData) });
  } catch (err) {
    console.error("Error fetching deleted users:", err);
    return res.status(500).json({ message: "Failed to fetch deleted users", error: err.message });
  }
};

// ----------------------------
// RESTORE SOFT-DELETED USER
// ----------------------------
export const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db.table("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.is_active) return res.status(400).json({ message: "User is already active" });

    await req.db.table("users").where({ id }).update({ is_active: true, updated_at: new Date() });

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_RESTORED",
      resource: "user",
      resourceId: id,
      metadata: safeUserData(user),
      req,
    });

    return res.json({ message: "User restored", user: safeUserData(user) });
  } catch (err) {
    console.error("Error restoring user:", err);
    return res.status(500).json({ message: "Failed to restore user", error: err.message });
  }
};
