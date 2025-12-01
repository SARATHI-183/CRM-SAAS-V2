// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email & password required' });
    }

    // Tenant-scoped DB via req.db
    const user = await req.db('users').where({ email }).first();
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ message: 'Server misconfigured' });
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        role: user.role,
        tenant_id: req.tenant.id,
      },
      secret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const { password: _, ...safeUser } = user;

    return res.json({
      message: "Login successful",
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ message: 'Login failed' });
  }
}

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
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await req.db('users')
      .where({ id: req.user.user_id })
      .first();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { password: _, ...safe } = user;

    return res.json({ user: safe });
  } catch (err) {
    console.error('me error:', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
}
