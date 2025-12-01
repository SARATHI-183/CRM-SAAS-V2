

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seed(knex) {
  // ------------------------------
  // 1. Super Admin
  // ------------------------------
  const superAdminEmail = 'superadmin@crm.com';
  const existingSuperAdmin = await knex('master.users').where({ email: superAdminEmail }).first();
  if (!existingSuperAdmin) {
    const superAdminId = uuidv4();
    const passwordHash = await bcrypt.hash('SuperAdmin123!', 10);
    await knex('master.users').insert([
      {
        id: superAdminId,
        name: 'Super Admin',
        email: superAdminEmail,
        password: passwordHash,
        role: 'super_admin',
        is_active: true,
      },
    ]);
  }

  // ------------------------------
  // 2. Roles
  // ------------------------------
  const roles = [
    { name: 'Super Admin', role_level: 1, description: 'Full system access' },
    { name: 'Tenant Admin', role_level: 2, description: 'Company Owner' },
    { name: 'Employee', role_level: 3, description: 'Tenant Employee' },
  ];

  const roleIds = {};
  for (const r of roles) {
    let role = await knex('master.roles').where({ name: r.name }).first();
    if (!role) {
      const id = uuidv4();
      await knex('master.roles').insert({ ...r, id });
      roleIds[r.name] = id;
    } else {
      roleIds[r.name] = role.id;
    }
  }

  // ------------------------------
  // 3. Permissions
  // ------------------------------
  const permissions = [
    { name: 'CREATE_USER', description: 'Create new user' },
    { name: 'UPDATE_USER', description: 'Update user details' },
    { name: 'DELETE_USER', description: 'Soft delete user' },
    { name: 'VIEW_USER', description: 'View user details' },
    { name: 'MANAGE_ROLES', description: 'Assign roles and permissions' },
    { name: 'MANAGE_MODULES', description: 'Manage CRM modules' },
    { name: 'MANAGE_TENANTS', description: 'Manage tenants (Super Admin only)' },
  ];

  const permissionIds = {};
  for (const p of permissions) {
    let perm = await knex('master.permissions').where({ name: p.name }).first();
    if (!perm) {
      const id = uuidv4();
      await knex('master.permissions').insert({ ...p, id });
      permissionIds[p.name] = id;
    } else {
      permissionIds[p.name] = perm.id;
    }
  }

  // ------------------------------
  // 4. Assign Permissions to Roles
  // ------------------------------
  const rolePermissionMap = {
    'Super Admin': Object.keys(permissionIds), // All permissions
    'Tenant Admin': ['CREATE_USER', 'UPDATE_USER', 'DELETE_USER', 'VIEW_USER', 'MANAGE_ROLES', 'MANAGE_MODULES'],
    'Employee': ['VIEW_USER'],
  };

  for (const [roleName, perms] of Object.entries(rolePermissionMap)) {
    const roleId = roleIds[roleName];
    for (const permName of perms) {
      const permId = permissionIds[permName];
      const exists = await knex('master.role_permissions')
        .where({ role_id: roleId, permission_id: permId })
        .first();
      if (!exists) {
        await knex('master.role_permissions').insert({ role_id: roleId, permission_id: permId });
      }
    }
  }

  // ------------------------------
  // 5. Industries
  // ------------------------------
  const industryNames = [
    'Real Estate','Education','Healthcare','IT Services','Manufacturing','Retail','Travel','Insurance','General Business'
  ];

  for (const name of industryNames) {
    const exists = await knex('master.industries').where({ name }).first();
    if (!exists) await knex('master.industries').insert({ id: uuidv4(), name });
  }

  // ------------------------------
  // 6. Plans
  // ------------------------------
  const plans = [
    { name: 'Basic', price: 49.99, limits: { users: 10, storage: '5GB' } },
    { name: 'Pro', price: 99.99, limits: { users: 50, storage: '50GB' } },
    { name: 'Enterprise', price: 199.99, limits: { users: 200, storage: '500GB' } },
  ];

  for (const p of plans) {
    const exists = await knex('master.plans').where({ name: p.name }).first();
    if (!exists) {
      await knex('master.plans').insert({ ...p, id: uuidv4(), limits: JSON.stringify(p.limits) });
    }
  }

  // ------------------------------
  // 7. Core Modules
  // ------------------------------
  const coreModules = ['Leads','Contacts','Companies','Deals','Invoices','Payments'];
  for (const name of coreModules) {
    const exists = await knex('master.modules').where({ name }).first();
    if (!exists) {
      await knex('master.modules').insert({ id: uuidv4(), name, type: 'core' });
    }
  }


  // ------------------------------
  // 8. Sync Tenant Users → master.user_roles
  // ------------------------------
  console.log("Syncing tenant users with master.user_roles...");

  const rolesMap = {};
  const allRoles = await knex("master.roles");
  allRoles.forEach(r => rolesMap[r.name.toLowerCase()] = r.id);

  // Fetch all tenants
  const tenants = await knex("master.tenants");

  for (const tenant of tenants) {
    const schema = tenant.schema_name;

    // Skip if schema doesn't exist yet
    const exists = await knex.raw(`
      SELECT schema_name FROM information_schema.schemata WHERE schema_name = ?;
    `, [schema]);

    if (exists.rows.length === 0) continue;

    // Fetch users in that tenant
    const users = await knex.withSchema(schema).table("users");

    for (const user of users) {
      const roleName = user.role?.toLowerCase();
      const roleId = rolesMap[roleName];

      if (!roleId) {
        console.log(`⚠️ Role not found for user: ${user.email}`);
        continue;
      }

      // Check if mapping already exists
      const existsMap = await knex("master.user_roles")
        .where({ user_id: user.id, role_id: roleId })
        .first();

      if (!existsMap) {
        await knex("master.user_roles").insert({
          user_id: user.id,
          role_id: roleId,
        });
        console.log(`✔ Synced: ${user.email} → ${roleName}`);
      }
    }
  }

}