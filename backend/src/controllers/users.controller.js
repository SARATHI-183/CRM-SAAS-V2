
// src/controllers/users.controller.js
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { knex } from "../db/knex.js"; // master DB for audit logs
import { auditLog } from "../utils/auditLogger.js";

/**
 * Helper: sanitize user data for API response
 */
const safeUserData = (user, roles = [], permissions = []) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  is_active: user.is_active,
  created_at: user.created_at,
  updated_at: user.updated_at,
  roles,
  permissions
});

/**
 * Helper: fetch roles for a user from tenant schema
 */
export const getUserRoles = async (tenantDb, userId) => {
  return tenantDb("user_roles")
    .join("roles", "user_roles.role_id", "roles.id")
    .where("user_roles.user_id", userId)
    .select("roles.id", "roles.name");
};

export const getUserPermissions = async (tenantDb, userId) => {
  return tenantDb("user_roles")
    .join("role_permissions", "user_roles.role_id", "role_permissions.role_id")
    .join("permissions", "role_permissions.permission_id", "permissions.id")
    .where("user_roles.user_id", userId)
    .distinct("permissions.key")
    .pluck("key");
};



/**
 * GET SINGLE USER
 */
export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await req.db("users").where({ id, is_active: true }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const roles = await getUserRoles(req.db, user.id);
    const perms = await getUserPermissions(req.db, user.id);
    
    return res.json({
      user: safeUserData(
      user,
      roles.map(r => r.name),
      perms
  )
});
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};

/**
 * GET ALL USERS (search, pagination, role filter)
 */
export const getAllUsers = async (req, res) => {
  try {
    const { search, role_name, page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let usersQuery = req.db("users").where({ is_active: true });

    if (search) {
      usersQuery = usersQuery.andWhere(qb =>
        qb.where("name", "ilike", `%${search}%`).orWhere("email", "ilike", `%${search}%`)
      );
    }

    const usersRaw = await usersQuery.offset(offset).limit(limit).select("*");

    const usersWithRoles = await Promise.all(
      usersRaw.map(async (u) => {
        const roles = await getUserRoles(req.db, u.id);
        // If role_name filter applied
        // if (role_name && !roles.includes(role_name)) return null;
        const roleFilter = role_name?.trim().toLowerCase();
        console.log("Filtering", roleFilter, "against", roles.map(r => r.name));

        if (roleFilter && !roles.some(r => r.name.toLowerCase() === roleFilter.toLowerCase())) {
          return null;
        }

        const perms = await getUserPermissions(req.db, u.id);
        return safeUserData(
          u,
          roles.map(r => r.name),
          perms
        );
      })
    );

    const filteredUsers = usersWithRoles.filter(u => u !== null);

    const totalCountObj = await req.db("users").where({ is_active: true }).count("* as count").first();
    const totalCount = parseInt(totalCountObj.count);

    return res.json({
      data: filteredUsers,
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

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role_name = "Employee", permissions: permKeys = [] } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [newUser] = await req.db("users")
      .insert({
        id: userId,
        name,
        email,
        password: hashedPassword,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    // Resolve or create role
    let role = await req.db("roles").where({ name: role_name }).first();

    if (!role) {
      [role] = await req.db("roles")
        .insert({
          id: uuidv4(),
          name: role_name,
          description: `${role_name} role`
        })
        .returning("*");
    }

    // Assign role to user
    await req.db("user_roles").insert({
      id: uuidv4(),
      user_id: userId,
      role_id: role.id
    });

    // Assign permissions if user sent any
    for (const key of permKeys) {
      const perm = await req.db("permissions").where({ key }).first();
      if (perm) {
        const exists = await req.db("role_permissions")
          .where({ role_id: role.id, permission_id: perm.id })
          .first();

        if (!exists) {
          await req.db("role_permissions").insert({
            id: uuidv4(),
            role_id: role.id,
            permission_id: perm.id
          });
        }
      }
    }

    // Lookup fresh roles + permissions for response
    const userRoles = await getUserRoles(req.db, userId);
    const userPerms = await getUserPermissions(req.db, userId);

    return res.status(201).json({
      message: "User created",
      user: safeUserData(
        newUser,
        userRoles.map(r => r.name),
        userPerms
      ),
    });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};


/**
 * UPDATE USER
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role_name, is_active } = req.body;

    const oldUser = await req.db("users").where({ id }).first();
    if (!oldUser) return res.status(404).json({ message: "User not found" });

    const updates = { updated_at: new Date() };
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (typeof is_active === "boolean") updates.is_active = is_active;

    const [updatedUser] = await req.db("users").where({ id }).update(updates).returning("*");

    // Update role if provided
    let updatedRoles = await getUserRoles(req.db, id);
    if (role_name) {
      const role = await resolveTenantRole(req.db, role_name);
      // Delete old roles and assign new one
      await req.db("user_roles").where({ user_id: id }).del();
      await req.db("user_roles").insert({ user_id: id, role_id: role.id });
      updatedRoles = [role.name];
    }

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_UPDATED",
      resource: "user",
      resourceId: id,
      metadata: { old_values: safeUserData(oldUser), new_values: safeUserData(updatedUser, updatedRoles) },
      req,
    });

    const perms = await getUserPermissions(req.db, id);

    return res.json({
      message: "User updated",
      user: safeUserData(updatedUser, updatedRoles, perms)
    });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

/**
 * SOFT DELETE USER
 */

export const softDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch user BEFORE deletion
    const user = await req.db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    const roles = await getUserRoles(req.db, id);
    const perms = await getUserPermissions(req.db, id);  // <-- fetch BEFORE delete

    // Soft delete
    await req.db("users")
      .where({ id })
      .update({ is_active: false, updated_at: new Date() });

    // audit log etc.
    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_SOFT_DELETED",
      resource: "user",
      resourceId: id,
      metadata: safeUserData(user, roles, perms),
      req,
    });

    return res.json({
      message: "User soft deleted",
      user: safeUserData(user, roles, perms),
    });

  } catch (err) {
    console.error("Error soft deleting user:", err);
    return res.status(500).json({ message: "Failed to soft delete user" });
  }
};

/**
 * HARD DELETE USER
 */

export const hardDeleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch user BEFORE deleting
    const user = await req.db("users").where({ id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2️⃣ Fetch roles + permissions BEFORE deleting
    const roles = await getUserRoles(req.db, id);       // returns array of { id, name }
    const perms = await getUserPermissions(req.db, id); // returns array of permission keys

    // 3️⃣ Delete mapping tables first
    await req.db("user_roles").where({ user_id: id }).del();
    await req.db("user_permissions").where({ user_id: id }).del().catch(() => {}); // optional if not used

    // 4️⃣ Delete the user last
    await req.db("users").where({ id }).del();

    // 5️⃣ Log audit (with snapshot of removed user)
    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_DELETED",
      resource: "user",
      resourceId: id,
      metadata: safeUserData(user, roles, perms),
      req,
    });

    // 6️⃣ Return full snapshot
    return res.json({
      message: "User deleted",
      user: safeUserData(user, roles, perms),
    });

  } catch (err) {
    console.error("Error hard deleting user:", err);
    return res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};


/**
 * RESTORE SOFT-DELETED USER
 */

export const restoreUser = async (req, res) => {
  try {
    const { id } = req.params;

    const oldUser = await req.db("users").where({ id }).first();
    if (!oldUser) return res.status(404).json({ message: "User not found" });
    if (oldUser.is_active)
      return res.status(400).json({ message: "User is already active" });

    // Update user
    await req.db("users")
      .where({ id })
      .update({ is_active: true, updated_at: new Date() });

    // Fetch updated user
    const user = await req.db("users").where({ id }).first();

    const roles = await getUserRoles(req.db, id);
    const perms = await getUserPermissions(req.db, id);

    await auditLog(knex, {
      userId: req.user?.id,
      tenantId: req.tenant?.id,
      action: "USER_RESTORED",
      resource: "user",
      resourceId: id,
      metadata: safeUserData(user, roles),
      req,
    });

    return res.json({
      message: "User restored",
      user: safeUserData(user, roles, perms),
    });
  } catch (err) {
    console.error("Error restoring user:", err);
    return res
      .status(500)
      .json({ message: "Failed to restore user", error: err.message });
  }
};


/**
 * GET SOFT-DELETED USERS
 */

export const getSoftDeletedUsers = async (req, res) => {
  try {
    const users = await req.db("users")
      .where({ is_active: false })
      .select("*");

    const usersWithRoles = await Promise.all(
      users.map(async (u) => {
        const roles = await getUserRoles(req.db, u.id);
        const perms = await getUserPermissions(req.db, u.id);

        return safeUserData(
          u,
          roles.map(r => r.name),
          perms
        );
      })
    );

    return res.status(200).json({
      message: "Soft deleted users fetched successfully",
      users: usersWithRoles
    });

  } catch (err) {
    console.error("Error fetching deleted users:", err);
    return res.status(500).json({
      message: "Failed to fetch deleted users",
      error: err.message
    });
  }
};

