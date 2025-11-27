// controllers/tenantController.js
import { knex } from '../db/knex.js';
import { createTenantSchema } from '../db/tenantSchema.js';
import { v4 as uuidv4 } from 'uuid';

export async function createTenant(req, res) {
  const { company_name, industry_type, plan_id } = req.body;

  if (!company_name) return res.status(400).json({ message: 'Company name is required' });

  try {
    // Generate unique schema name
    const schema_name = company_name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();

    // Insert into master.tenants
    const [tenant] = await knex('master.tenants')
      .insert({
        id: uuidv4(),
        company_name,
        industry_type,
        plan_id,
        schema_name,
        status: 'active',
      })
      .returning('*');

    // Create tenant schema and core tables
    await createTenantSchema(schema_name);

    res.status(201).json({ message: 'Tenant created', tenant });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create tenant', error: err.message });
  }
}
