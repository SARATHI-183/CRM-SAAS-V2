import jwt from 'jsonwebtoken';
import { knex } from '../db/knex.js';

export async function requireSuperAdmin(req, res, next) {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

    const token = auth.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).json({ message: 'Server not configured' });

    const payload = jwt.verify(token, secret);
    if (!payload?.user_id) return res.status(401).json({ message: 'Unauthorized' });

    // fetch user from master DB
    const user = await knex('master.users').where({ id: payload.user_id }).first();
    if (!user || user.role !== 'super_admin') return res.status(403).json({ message: 'Forbidden' });

    req.superadmin = user;
    next();
  } catch (err) {
    console.error('requireSuperAdmin error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
}
