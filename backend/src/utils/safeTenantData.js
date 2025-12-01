export function safeTenantData(tenant) {
  if (!tenant) return {};
  const {
    id,
    company_name,
    company_email,
    company_phone,
    company_website,
    industry_type,
    plan_id,
    status,
    schema_name,
    created_at,
    updated_at,
  } = tenant;

  return {
    id,
    company_name,
    company_email,
    company_phone,
    company_website,
    industry_type,
    plan_id,
    status,
    schema_name,
    created_at,
    updated_at: updated_at && typeof updated_at.toISOString === 'function'
      ? updated_at.toISOString()
      : updated_at,
  };
}
