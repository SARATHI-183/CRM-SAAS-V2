// src/middlewares/tenantResolver.js
import jwt from 'jsonwebtoken';
import { getTenantMeta, getTenantDb } from '../db/tenantManager.js';

const APP_DOMAIN = process.env.APP_DOMAIN || 'localhost';
const SUBDOMAIN_ENABLED = process.env.SUBDOMAIN_ENABLED === 'true';
const JWT_TENANT_CLAIM = process.env.JWT_TENANT_CLAIM || 'tenant_id';
const ALLOW_HEADER_TENANT = process.env.ALLOW_HEADER_TENANT !== 'false';

// ----------------------------------------------------------
// Extract subdomain (tenant.myapp.com)
// ----------------------------------------------------------
function extractSubdomain(req) {
  const host = req.headers.host || '';
  if (!host) return null;

  const noPort = host.split(':')[0];

  if (!SUBDOMAIN_ENABLED) return null;
  if (noPort === APP_DOMAIN) return null;

  if (noPort.endsWith(`.${APP_DOMAIN}`)) {
    return noPort.replace(`.${APP_DOMAIN}`, '');
  }

  return null;
}

// ----------------------------------------------------------
// JWT -> extract tenant claim
// ----------------------------------------------------------
function parseTenantFromJwt(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;

  const token = auth.slice(7);

  try {
    const secret = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET;
    if (!secret) return null;

    const payload = jwt.verify(token, secret);

    if (payload?.[JWT_TENANT_CLAIM]) {
      return payload[JWT_TENANT_CLAIM];
    }

    return null;
  } catch {
    return null;
  }
}

// ----------------------------------------------------------
// MAIN MIDDLEWARE (ESM default export)
// ----------------------------------------------------------
export default function tenantResolver() {
  return async function tenantResolverMiddleware(req, res, next) {
    try {
      let tenantLookup = null;

      // 1) SUBDOMAIN
      const sub = extractSubdomain(req);
      if (sub) {
        tenantLookup = { schema_name: `tenant_${sub}` };
      }

      // 2) HEADER
      if (!tenantLookup && ALLOW_HEADER_TENANT) {
        const header = req.headers['x-tenant-id'] || req.headers['x-tenant-schema'];
        if (header) {
          if (header.startsWith('tenant_')) tenantLookup = { schema_name: header };
          else if (header.includes('@')) tenantLookup = { company_email: header };
          else tenantLookup = { id: header };
        }
      }

      // 3) JWT
      if (!tenantLookup) {
        const claim = parseTenantFromJwt(req);
        if (claim) {
          if (claim.startsWith('tenant_')) tenantLookup = { schema_name: claim };
          else tenantLookup = { id: claim };
        }
      }

      // No tenant found → allow public routes
      if (!tenantLookup) return next();

      const meta = await getTenantMeta(tenantLookup);

      if (!meta) {
        return res.status(404).json({ message: 'Tenant not found' });
      }

      if (meta.status !== 'active') {
        return res.status(403).json({ message: 'Tenant inactive' });
      }

      // Attach tenant context
      req.tenant = meta;
      req.db = getTenantDb(meta.schema_name);

      return next();
    } catch (err) {
      console.error('tenantResolver error', err);
      return res.status(500).json({ message: 'Failed to resolve tenant' });
    }
  };
}
