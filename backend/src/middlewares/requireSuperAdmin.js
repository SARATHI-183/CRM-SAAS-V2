// import jwt from 'jsonwebtoken';
// import { knex } from '../db/knex.js';

// export async function requireSuperAdmin(req, res, next) {
//   try {
//     const auth = req.headers.authorization || '';
//     if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' });

//     const token = auth.slice(7);
//     const secret = process.env.JWT_SECRET;
//     if (!secret) return res.status(500).json({ message: 'Server not configured' });

//     const payload = jwt.verify(token, secret);
//     if (!payload?.user_id) return res.status(401).json({ message: 'Unauthorized' });

//     // fetch user from master DB
//     const user = await knex('master.users').where({ id: payload.user_id }).first();
//     if (!user || user.role !== 'super_admin') return res.status(403).json({ message: 'Forbidden' });

//     req.superadmin = user;
//     next();
//   } catch (err) {
//     console.error('requireSuperAdmin error:', err);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// }


// /middlewares/requireSuperAdmin.js
import jwt from 'jsonwebtoken';
import { knex } from '../db/knex.js';

/**
 * Middleware to ensure the user is a super_admin.
 * Checks JWT, fetches user from master DB, and verifies role.
 */
export async function requireSuperAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.slice(7);
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('JWT_SECRET not configured in environment');
      return res.status(500).json({ message: 'Server misconfiguration' });
    }

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (!payload?.user_id) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    // Fetch user from master DB
    const user = await knex('master.users').where({ id: payload.user_id }).first();
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    if (user.role !== 'super_admin') {
      return res.status(403).json({ message: 'Forbidden: Not a super admin' });
    }

    if (!user.is_active) {
      return res.status(403).json({ message: 'Forbidden: Account inactive' });
    }

    // Attach user to request
    req.superadmin = user;
    next();
  } catch (err) {
    console.error('requireSuperAdmin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

export default requireSuperAdmin;
