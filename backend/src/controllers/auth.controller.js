// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email & password required" });
    }

    const db = req.db;

    // 1️⃣ Find user inside tenant schema
    const user = await db("users").where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 2️⃣ Check password
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Get roles
    const roles = await db("user_roles")
      .join("roles", "user_roles.role_id", "roles.id")
      .where("user_roles.user_id", user.id)
      .select("roles.name");

    const roleNames = roles.map((r) => r.name);

    // 4️⃣ Get permissions
    const permissions = await db("permissions")
      .join("role_permissions", "permissions.id", "role_permissions.permission_id")
      .join("user_roles", "role_permissions.role_id", "user_roles.role_id")
      .where("user_roles.user_id", user.id)
      .distinct("permissions.key");

    const permissionList = permissions.map((p) => p.key);

    // 5️⃣ Create JWT
    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        tenant_id: req.tenant.id,
        roles: roleNames,
        permissions: permissionList,
      },
      process.env.JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password before sending
    const { password: _, ...safe } = user;

    return res.json({
      message: "Login successful",
      token,
      user: safe,
      roles: roleNames,
      permissions: permissionList,
    });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ message: "Login failed" });
  }
}

// export async function login(req, res) {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: "email & password required" });
//     }

//     // tenant-scoped DB
//     const db = req.db;

//     // 1️⃣ Find user
//     const user = await db("users").where({ email }).first();
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     // 2️⃣ Validate password
//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(400).json({ message: "Invalid credentials" });

//     // 3️⃣ Load roles from tenant schema
//     const roles = await db("roles")
//       .join("user_roles", "roles.id", "user_roles.role_id")
//       .where("user_roles.user_id", user.id)
//       .select("roles.name");

//     const roleNames = roles.map((r) => r.name);

//     // 4️⃣ Load permissions for those roles
//     const permissions = await req.db('permissions')
//     .select('key')   // ✅ correct column
//     .innerJoin('role_permissions', 'permissions.id', 'role_permissions.permission_id')
//     .innerJoin('user_roles', 'role_permissions.role_id', 'user_roles.role_id')
//     .where('user_roles.user_id', user.id);


//     const roleList = roles.map(r => r.name);
//     const permissionList = permissions.map((p) => p.key);

//     // 5️⃣ Create token including RBAC
//     const token = jwt.sign(
//       {
//         user_id: user.id,
//         email: user.email,
//         tenant_id: req.tenant.id,
//         roles: roleList,
//         permissions: permissionList,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: JWT_EXPIRES_IN }
//     );

//     const { password: _, ...safe } = user;

//     return res.json({
//       message: "Login successful",
//       token,
//       user: safe,
//       roles: roleNames,
//       permissions: permissionList,
//     });
//   } catch (err) {
//     console.error("login error:", err);
//     return res.status(500).json({ message: "Login failed" });
//   }
// }

// export async function login(req, res) {

//   try {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ message: 'email & password required' });
//     }

//     // Tenant-scoped DB via req.db
//     const user = await req.db('users').where({ email }).first();
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       return res.status(500).json({ message: 'Server misconfigured' });
//     }

//     const token = jwt.sign(
//       {
//         user_id: user.id,
//         email: user.email,
//         role: user.role,
//         tenant_id: req.tenant.id,
//       },
//       secret,
//       { expiresIn: JWT_EXPIRES_IN }
//     );

//     const { password: _, ...safeUser } = user;

//     return res.json({
//       message: "Login successful",
//       token,
//       user: safeUser,
//     });
//   } catch (err) {
//     console.error('login error:', err);
//     return res.status(500).json({ message: 'Login failed' });
//   }
// }

// PUT /api/v1/auth/change-password
export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    // Get user from tenant DB
    const user = await req.db.table("users").where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify current password
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await req.db.table("users").where({ id: req.user.id }).update({ password: hashedPassword });

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("changePassword error", err);
    return res.status(500).json({ message: "Failed to change password" });
  }
}

export async function me(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const db = req.db;

    const user = await db("users")
      .where({ id: req.user.user_id })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Load roles
    const roles = await db("user_roles")
      .join("roles", "user_roles.role_id", "roles.id")
      .where("user_roles.user_id", user.id)
      .select("roles.name");

    const roleNames = roles.map((r) => r.name);

    // Load permissions
    const permissions = await db("permissions")
      .join("role_permissions", "permissions.id", "role_permissions.permission_id")
      .join("user_roles", "role_permissions.role_id", "user_roles.role_id")
      .where("user_roles.user_id", user.id)
      .distinct("permissions.key");

    const permissionList = permissions.map((p) => p.key);

    const { password: _, ...safe } = user;

    return res.json({
      user: safe,
      roles: roleNames,
      permissions: permissionList,
    });
  } catch (err) {
    console.error("me error:", err);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
}
