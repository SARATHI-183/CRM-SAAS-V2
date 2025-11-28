// src/controllers/users.controller.js
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const getAllUsers = async (req, res) => {
  try {
    const users = await req.db.table("users").select("id", "name", "email", "role", "is_active", "created_at", "updated_at");
    return res.json({ data: users });
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await req.db.table("users").insert({
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role: role || "employee",
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    }).returning(["id", "name", "email", "role", "is_active", "created_at", "updated_at"]);

    return res.status(201).json({ message: "User created", user: newUser[0] });
  } catch (err) {
    console.error("Error creating user:", err);
    return res.status(500).json({ message: "Failed to create user", error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role, is_active } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (password) updates.password = await bcrypt.hash(password, 10);
    if (role) updates.role = role;
    if (typeof is_active === "boolean") updates.is_active = is_active;
    updates.updated_at = new Date();

    const updated = await req.db.table("users").where({ id }).update(updates).returning(["id", "name", "email", "role", "is_active", "created_at", "updated_at"]);
    if (!updated.length) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User updated", user: updated[0] });
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).json({ message: "Failed to update user", error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await req.db.table("users").where({ id }).del();
    if (!deleted) return res.status(404).json({ message: "User not found" });

    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    return res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
