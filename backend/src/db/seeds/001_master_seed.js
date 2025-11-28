// seeds/001_master_seed.js
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex) {
  // =========================================================
  // 1. Super Admin
  // =========================================================
  const superAdminId = uuidv4();
  const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);

  await knex('master.users').insert([
    {
      id: superAdminId,
      name: 'Super Admin',
      email: 'superadmin@crm.com',
      password: passwordHash,
      role: 'super_admin',
      is_active: true,
    },
  ]);

  // =========================================================
  // 2. Roles
  // =========================================================
  const tenantAdminRoleId = uuidv4();
  const employeeRoleId = uuidv4();

  await knex('master.roles').insert([
    {
      id: tenantAdminRoleId,
      name: 'Tenant Admin',
      role_level: 2, // hierarchy check
      description: 'Company Owner',
    },
    {
      id: employeeRoleId,
      name: 'Employee',
      role_level: 3,
      description: 'Tenant Employee',
    },
  ]);

  // =========================================================
  // 3. Industries
  // =========================================================
  const industries = [
    'Real Estate',
    'Education',
    'Healthcare',
    'IT Services',
    'Manufacturing',
    'Retail',
    'Travel',
    'Insurance',
    'General Business',
  ].map((name) => ({
    id: uuidv4(),
    name,
  }));

  await knex('master.industries').insert(industries);

  // =========================================================
  // 4. Default Plans
  // =========================================================
  const plans = [
    {
      id: uuidv4(),
      name: 'Basic',
      price: 49.99,
      limits: JSON.stringify({ users: 10, storage: '5GB' }),
    },
    {
      id: uuidv4(),
      name: 'Pro',
      price: 99.99,
      limits: JSON.stringify({ users: 50, storage: '50GB' }),
    },
    {
      id: uuidv4(),
      name: 'Enterprise',
      price: 199.99,
      limits: JSON.stringify({ users: 200, storage: '500GB' }),
    },
  ];

  await knex('master.plans').insert(plans);

  // =========================================================
  // 5. Core Modules
  // =========================================================
  const coreModules = [
    'Leads',
    'Contacts',
    'Companies',
    'Deals',
    'Invoices',
    'Payments',
  ].map((name) => ({
    id: uuidv4(),
    name,
    type: 'core',
  }));

  await knex('master.modules').insert(coreModules);
}
