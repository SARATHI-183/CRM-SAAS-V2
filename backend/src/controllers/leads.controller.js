import { v4 as uuidv4 } from "uuid";

/**
 * All tenant-level controllers should use `req.db` to access tenant schema.
 */

export const getLeads = async (req, res) => {
  try {
    const leads = await req.db.table("leads").select("*");
    return res.json({ data: leads });
  } catch (err) {
    console.error("Error fetching leads:", err);
    return res.status(500).json({ message: "Failed to fetch leads", error: err.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    if (!name || !email) {
      return res.status(400).json({ message: "name & email required" });
    }

    const newLeadId = uuidv4();

    await req.db.table("leads").insert({
      id: newLeadId,
      name,
      email,
      phone,
      status: status || "new",
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({ message: "Lead created", lead: { id: newLeadId, name, email, phone, status: status || "new" } });
  } catch (err) {
    console.error("Error creating lead:", err);
    return res.status(500).json({ message: "Failed to create lead", error: err.message });
  }
};
