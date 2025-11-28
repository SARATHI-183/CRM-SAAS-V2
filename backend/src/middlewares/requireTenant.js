// export default function requireTenant(req, res, next) {
//   if (!req.tenantId || !req.tenantSchema) {
//     return res.status(400).json({
//       message: 'Tenant not resolved. Include X-Tenant-ID or subdomain.'
//     });
//   }
//   next();
// }

// src/middlewares/requireTenant.js
/**
 * Ensures that tenant is resolved by tenantResolver
 * Attaches req.tenant and req.db
 */
export default function requireTenant(req, res, next) {
  if (!req.tenant || !req.db) {
    return res.status(403).json({
      message:
        "Tenant context required. Make sure tenantResolver runs before this middleware.",
    });
  }
  next();
}
