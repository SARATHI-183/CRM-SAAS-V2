// import { create } from "zustand";

// export const useContactsStore = create((set, get) => ({
//   contacts: [
//     // your initial default data
//     {
//       id: 1,
//       tenantId: "tenant_001",
//       name: "John Doe",
//       company: "TechCorp",
//       email: "john@techcorp.com",
//       phone: "+91 9876543210",
//       status: "Active",
//       createdAt: "2025-01-10",
//     },
//     {
//       id: 2,
//       tenantId: "tenant_001",
//       name: "Sarah Wilson",
//       company: "BrightSoft",
//       email: "sarah@brightsoft.io",
//       phone: "+91 9988776655",
//       status: "Lead",
//       createdAt: "2025-01-14",
//     }
//   ],

//   // Add a new contact
//   addContact: (data) =>
//     set((state) => ({
//       contacts: [...state.contacts, data],
//     })),

//   // Delete a contact
//   deleteContact: (id) =>
//     set((state) => ({
//       contacts: state.contacts.filter((c) => c.id !== id),
//     })),

//   // Update a contact
//   updateContact: (id, updated) =>
//     set((state) => ({
//       contacts: state.contacts.map((c) =>
//         c.id === id ? { ...c, ...updated } : c
//       ),
//     })),

//   // Get a single contact by ID
//   getContactById: (id) => get().contacts.find((c) => c.id === id),
// }));
import { create } from "zustand";

export const useContactsStore = create((set) => ({
  contacts: [],

  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, contact],
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((c) => c.id !== id),
    })),
}));

