// db/tenantSchema.js
import { knex } from './knex.js';

/**
 * Creates a new tenant schema and core tables.
 * @param {string} schemaName - The schema name (must be unique)
 */
export async function createTenantSchema(schemaName) {
  // 1. Create schema
  await knex.raw(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

  // 2. Create core tables in tenant schema
  await knex.schema.withSchema(schemaName).createTable('leads', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('email').unique();
    table.string('phone');
    table.string('status').defaultTo('new');
    table.timestamps(true, true);
  });

  await knex.schema.withSchema(schemaName).createTable('contacts', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable();
    table.string('last_name');
    table.string('email').unique();
    table.string('phone');
    table.timestamps(true, true);
  });

  await knex.schema.withSchema(schemaName).createTable('deals', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('title').notNullable();
    table.decimal('value', 12, 2).defaultTo(0);
    table.string('status').defaultTo('open');
    table.timestamps(true, true);
  });

  await knex.schema.withSchema(schemaName).createTable('companies', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('name').notNullable();
    table.string('website');
    table.timestamps(true, true);
  });

  return true;
}
