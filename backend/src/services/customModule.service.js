// /services/customModuleService.js
import { knex } from "../db/knex.js";

/**
 * Create a dynamic custom module table for a tenant
 * @param {string} schemaName - Tenant schema
 * @param {string} moduleName - Module name (table will be named dynamically)
 * @param {Array<{name: string, type: string}>} fields - Array of field definitions
 */
export async function createCustomModuleTable(schemaName, moduleName, fields) {
  const tableName = moduleName.toLowerCase().replace(/\s+/g, "_");

  // Check if table exists already
  const exists = await knex.schema.withSchema(schemaName).hasTable(tableName);
  if (exists) throw new Error(`Custom module table "${tableName}" already exists for tenant ${schemaName}`);

  // Create table dynamically
  await knex.schema.withSchema(schemaName).createTable(tableName, (table) => {
    table.uuid("id").defaultTo(knex.raw("uuid_generate_v4()")).primary();
    fields.forEach((f) => {
      switch (f.type) {
        case "string":
          table.string(f.name);
          break;
        case "text":
          table.text(f.name);
          break;
        case "number":
          table.decimal(f.name, 12, 2).defaultTo(0);
          break;
        case "boolean":
          table.boolean(f.name).defaultTo(false);
          break;
        case "date":
          table.date(f.name);
          break;
        case "datetime":
          table.timestamp(f.name);
          break;
        case "json":
          table.jsonb(f.name).defaultTo("{}");
          break;
        default:
          throw new Error(`Unsupported field type "${f.type}"`);
      }
    });
    table.timestamps(true, true);
  });

  // Insert metadata into custom_modules table
  const moduleId = await knex(`${schemaName}.custom_modules`).insert({
    name: moduleName,
    settings: JSON.stringify({ fields }),
  }).returning("id");

  // Insert fields metadata into custom_fields table
  for (const f of fields) {
    await knex(`${schemaName}.custom_fields`).insert({
      module_id: moduleId[0].id,
      name: f.name,
      type: f.type,
      settings: JSON.stringify(f.settings || {}),
    });
  }

  return tableName;
}

/**
 * Drop a dynamic custom module table for a tenant
 * @param {string} schemaName
 * @param {string} moduleName
 */
export async function dropCustomModuleTable(schemaName, moduleName) {
  const tableName = moduleName.toLowerCase().replace(/\s+/g, "_");
  const exists = await knex.schema.withSchema(schemaName).hasTable(tableName);
  if (!exists) return;

  // Drop table
  await knex.schema.withSchema(schemaName).dropTable(tableName);

  // Remove metadata
  const module = await knex(`${schemaName}.custom_modules`).where({ name: moduleName }).first();
  if (module) {
    await knex(`${schemaName}.custom_fields`).where({ module_id: module.id }).del();
    await knex(`${schemaName}.custom_modules`).where({ id: module.id }).del();
  }
}
