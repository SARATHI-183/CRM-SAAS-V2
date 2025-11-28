// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email & password required' });

    // req.db is tenant scoped
    const user = await req.db.table('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'Server not configured' });

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

    // don't return password
    const { password: _, ...safeUser } = user;

    return res.json({ token, user: safeUser });
  } catch (err) {
    console.error('login error', err);
    return res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req, res) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const user = await req.db.table('users').where({ id: req.user.id }).first();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password: _, ...safe } = user;
    return res.json({ user: safe });
  } catch (err) {
    console.error('me error', err);
    return res.status(500).json({ message: 'Failed to fetch user' });
  }
}
