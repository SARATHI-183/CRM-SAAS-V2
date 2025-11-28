// src/db/tenantManager.js
import { knex } from './knex.js';
import { LRUCache } from 'lru-cache';


const redisUrl = process.env.REDIS_URL || null;
let redisClient = null;

if (redisUrl) {
  const Redis = (await import('ioredis')).default;
  redisClient = new Redis(redisUrl);
}

// LRU fallback
const cache = new LRUCache({
  max: 5000,
  ttl: 1000 * 60 * 10, // 10 minutes
});

// -----------------------------------------------
// Fetch Tenant From DB
// -----------------------------------------------
async function fetchTenantFromDb({ id, schema_name, company_email } = {}) {
  const q = knex.withSchema('master').table('tenants').select('*').limit(1);

  if (id) q.where({ id });
  else if (schema_name) q.where({ schema_name });
  else if (company_email) q.where({ company_email });
  else return null;

  const rows = await q;
  return rows[0] || null;
}

function cacheKeyFor(lookup) {
  if (!lookup) return null;
  if (lookup.id) return `tenant:id:${lookup.id}`;
  if (lookup.schema_name) return `tenant:schema:${lookup.schema_name}`;
  if (lookup.company_email) return `tenant:email:${lookup.company_email}`;
  return null;
}

// -----------------------------------------------
// getTenantMeta()
// -----------------------------------------------
export async function getTenantMeta(lookup) {
  const key = cacheKeyFor(lookup);
  if (!key) return null;

  // Redis
  if (redisClient) {
    const raw = await redisClient.get(key);
    if (raw) return JSON.parse(raw);
  }

  // LRU
  const cached = cache.get(key);
  if (cached) return cached;

  // DB fallback
  const tenant = await fetchTenantFromDb(lookup);
  if (!tenant) return null;

  const meta = {
    id: tenant.id,
    company_name: tenant.company_name,
    schema_name: tenant.schema_name,
    industry_type: tenant.industry_type,
    plan_id: tenant.plan_id,
    status: tenant.status,
    company_email: tenant.company_email,
    created_at: tenant.created_at,
    updated_at: tenant.updated_at,
  };

  // Save caches
  if (redisClient) await redisClient.set(key, JSON.stringify(meta), 'EX', 600);
  cache.set(key, meta);

  return meta;
}

// -----------------------------------------------
// getTenantDb()
// -----------------------------------------------
export function getTenantDb(schemaName) {
  if (!schemaName) throw new Error('schemaName required');

  return {
    knex,
    schema: schemaName,

    table: (t) => knex.withSchema(schemaName).table(t),

    selectFrom: (t) =>
      knex.withSchema(schemaName).select('*').from(t),

    rawWithSchema: (sql, bindings = []) =>
      knex.withSchema(schemaName).raw(sql, bindings),

    trx: (cb) =>
      knex.transaction((trx) =>
        cb({
          table: (t) => trx.withSchema(schemaName).table(t),
          raw: (sql, bindings = []) =>
            trx.withSchema(schemaName).raw(sql, bindings),
          trx,
        })
      ),
  };
}

// -----------------------------------------------
// invalidate cache
// -----------------------------------------------
export async function invalidateTenantCache(tenantMeta) {
  if (!tenantMeta) return;

  const keys = [
    `tenant:id:${tenantMeta.id}`,
    `tenant:schema:${tenantMeta.schema_name}`,
    `tenant:email:${tenantMeta.company_email}`,
  ];

  keys.forEach((k) => cache.delete(k));

  if (redisClient) {
    for (const k of keys) await redisClient.del(k);
  }
}
