
// // /src/middlewares/tenantResolver.js
// import jwt from 'jsonwebtoken';
// import { getTenantMeta, getTenantDb } from '../db/tenantManager.js';

// const APP_DOMAIN = process.env.APP_DOMAIN || 'localhost';
// const SUBDOMAIN_ENABLED = process.env.SUBDOMAIN_ENABLED === 'true';
// const JWT_TENANT_CLAIM = process.env.JWT_TENANT_CLAIM || 'tenant_id';
// const ALLOW_HEADER_TENANT = process.env.ALLOW_HEADER_TENANT !== 'false';

// function extractSubdomain(req) {
//   const host = (req.headers.host || '').split(':')[0];
//   if (!SUBDOMAIN_ENABLED) return null;
//   if (!host || host === APP_DOMAIN) return null;
//   if (host.endsWith(`.${APP_DOMAIN}`)) return host.replace(`.${APP_DOMAIN}`, '');
//   return null;
// }

// function parseTenantFromJwt(req) {
//   const auth = req.headers.authorization || '';
//   if (!auth.startsWith('Bearer ')) return null;

//   const token = auth.slice(7);
//   try {
//     const secret = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET;
//     if (!secret) return null;
//     const payload = jwt.verify(token, secret);
//     return payload?.[JWT_TENANT_CLAIM] || null;
//   } catch {
//     return null;
//   }
// }

// export default function tenantResolver() {
//   return async (req, res, next) => {
//     try {
//       let tenantLookup = null;

//       // 1) Subdomain
//       const sub = extractSubdomain(req);
//       if (sub) tenantLookup = { schema_name: `tenant_${sub}` };

//       // 2) Header
//       if (!tenantLookup && ALLOW_HEADER_TENANT) {
//         const header = req.headers['x-tenant-id'] || req.headers['x-tenant-schema'];
//         if (header) tenantLookup = header.startsWith('tenant_') ? { schema_name: header } : { id: header };
//       }

//       // 3) JWT
//       if (!tenantLookup) {
//         const claim = parseTenantFromJwt(req);
//         if (claim) tenantLookup = claim.startsWith('tenant_') ? { schema_name: claim } : { id: claim };
//       }

//       if (!tenantLookup) return next();

//       const meta = await getTenantMeta(tenantLookup);
//       if (!meta) return res.status(404).json({ message: 'Tenant not found' });
//       if (meta.status !== 'active') return res.status(403).json({ message: 'Tenant inactive' });

//       req.tenant = meta;
//       req.db = getTenantDb(meta.schema_name);
//       next();
//     } catch (err) {
//       console.error('tenantResolver error', err);
//       res.status(500).json({ message: 'Failed to resolve tenant' });
//     }
//   };
// }


// src/middlewares/tenantResolver.js
import jwt from "jsonwebtoken";
import { knex } from "../db/knex.js"; // master DB instance
import { getTenantMeta, getTenantDb } from "../db/tenantManager.js";

const APP_DOMAIN = process.env.APP_DOMAIN || "localhost";
const SUBDOMAIN_ENABLED = process.env.SUBDOMAIN_ENABLED === "true";
const JWT_TENANT_CLAIM = process.env.JWT_TENANT_CLAIM || "tenant_id";
const ALLOW_HEADER_TENANT = process.env.ALLOW_HEADER_TENANT !== "false";

function extractSubdomain(req) {
  const host = (req.headers.host || "").split(":")[0];
  if (!SUBDOMAIN_ENABLED) return null;
  if (!host || host === APP_DOMAIN) return null;
  if (host.endsWith(`.${APP_DOMAIN}`)) return host.replace(`.${APP_DOMAIN}`, "");
  return null;
}

function parseTenantFromJwt(req) {
  const auth = req.headers.authorization || "";
  if (!auth.startsWith("Bearer ")) return null;

  const token = auth.slice(7);
  try {
    const secret = process.env.JWT_PUBLIC_KEY || process.env.JWT_SECRET;
    if (!secret) return null;

    const payload = jwt.verify(token, secret);
    return payload?.[JWT_TENANT_CLAIM] || null;
  } catch {
    return null;
  }
}

export default function tenantResolver() {
  return async (req, res, next) => {
    try {
      // Attach MASTER DB always
      req.dbMaster = knex;

      let tenantLookup = null;

      // 1) Subdomain
      const sub = extractSubdomain(req);
      if (sub) tenantLookup = { schema_name: `tenant_${sub}` };

      // 2) Header
      if (!tenantLookup && ALLOW_HEADER_TENANT) {
        const header = req.headers["x-tenant-id"] || req.headers["x-tenant-schema"];
        if (header) {
          tenantLookup = header.startsWith("tenant_")
            ? { schema_name: header }
            : { id: header };
        }
      }

      // 3) JWT
      if (!tenantLookup) {
        const claim = parseTenantFromJwt(req);
        if (claim) {
          tenantLookup = claim.startsWith("tenant_")
            ? { schema_name: claim }
            : { id: claim };
        }
      }

      // PUBLIC ROUTES
      if (!tenantLookup) return next();

      // Fetch tenant metadata
      const meta = await getTenantMeta(tenantLookup);
      if (!meta) return res.status(404).json({ message: "Tenant not found" });
      if (meta.status !== "active")
        return res.status(403).json({ message: "Tenant inactive" });

      // Attach tenant metadata
      req.tenant = meta;

      // TENANT DB instance
      req.dbTenant = getTenantDb(meta.schema_name);

      req.db = req.dbTenant; // <--- key fix

      // (OPTIONAL — but consistent)
      // req.db = req.dbMaster; // avoid breaking old code

      return next();
    } catch (err) {
      console.error("tenantResolver error", err);
      return res.status(500).json({ message: "Failed to resolve tenant" });
    }
  };
}
