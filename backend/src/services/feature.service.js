// services/featureService.js
import { knex } from "../knex.js";

/**
 * Get effective features for a tenant
 * Combines plan features + superadmin overrides
 * @param {string} tenantId
 */
export async function getTenantFeatures(tenantId) {
  // 1. Get tenant plan
  const tenant = await knex("master.tenants").where("id", tenantId).first();
  if (!tenant) return [];

  // 2. Get plan features
  const planFeatures = await knex("master.plan_features")
    .join("master.features", "plan_features.feature_id", "features.id")
    .where("plan_features.plan_id", tenant.plan_id)
    .select("features.feature_key", "plan_features.limit_value", "plan_features.is_enabled");

  // 3. Get tenant overrides
  const overrides = await knex("master.tenant_feature_overrides")
    .join("master.features", "tenant_feature_overrides.feature_id", "features.id")
    .where("tenant_feature_overrides.tenant_id", tenantId)
    .select(
      "features.feature_key",
      "tenant_feature_overrides.is_enabled",
      "tenant_feature_overrides.limit_value"
    );

  // 4. Merge plan + overrides (overrides take priority)
  const featureMap = {};
  planFeatures.forEach((f) => {
    featureMap[f.feature_key] = { is_enabled: f.is_enabled, limit_value: f.limit_value };
  });
  overrides.forEach((o) => {
    featureMap[o.feature_key] = { is_enabled: o.is_enabled, limit_value: o.limit_value };
  });

  return featureMap; // { "custom_modules": {is_enabled: true, limit_value: 10}, ... }
}

/**
 * Check if a tenant feature is enabled
 */
export async function isFeatureEnabled(tenantId, featureKey) {
  const features = await getTenantFeatures(tenantId);
  return features[featureKey]?.is_enabled === true;
}
