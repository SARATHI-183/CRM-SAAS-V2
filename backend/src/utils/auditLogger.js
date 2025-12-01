import { knex } from "../db/knex.js";
import { v4 as uuidv4 } from "uuid";

export async function auditLog(trx, {
  userId,
  tenantId,
  action,
  resource = null,
  resourceId = null,
  metadata = {},
  req
}) {
  try {
    // Only primitive/serializable metadata
    const safeMetadata = JSON.parse(JSON.stringify(metadata));

    await trx("master.audit_logs").insert({
      id: uuidv4(),
      user_id: userId || null,
      tenant_id: tenantId || null,
      action,
      resource,
      resource_id: resourceId,
      metadata: safeMetadata,
      ip_address: req?.ip || null,
      user_agent: req?.headers?.["user-agent"] || null,
    });
  } catch (err) {
    console.error("AUDIT LOG ERROR:", err);
  }
}
