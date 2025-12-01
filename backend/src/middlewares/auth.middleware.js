// src/middlewares/auth.middleware.js
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    if (!header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }

    const token = header.slice(7);
    const secret = process.env.JWT_SECRET;
    
    if (!secret) return res.status(500).json({ message: 'JWT_SECRET not configured' });

    const payload = jwt.verify(token, secret);

    // Basic sanity: ensure token tenant matches resolved tenant (if tenantResolver used)
    if (req.tenant && payload.tenant_id && payload.tenant_id !== req.tenant.id) {
      return res.status(401).json({ message: 'Token tenant mismatch' });
    }

    let roles = [];

    if(Array.isArray(payload.roles)){
      roles = payload.roles;
    }

    else if(payload.role){
      roles = [payload.role];
    }

    // Attach user info (minimal)
    req.user = {
      id: payload.user_id,
      email: payload.email,
      tenant_id: payload.tenant_id,
      roles,
      Permissions: payload.Permissions || []
    };

    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
