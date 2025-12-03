// src/store/useLeadDetails.js
import { create } from "zustand";
import { useLeads } from "./useLeads"; // import your main leads store

export const useLeadDetails = create((set, get) => ({
  lead: null, // currently selected lead

  // Fetch details of one lead by ID
  fetchLeadById: (id) => {
    const { leads } = useLeads.getState();
    const selected = leads.find((l) => l.id === Number(id)) || null;
    set({ lead: selected });
  },

  // Update a lead from this details page
  updateLeadField: (field, value) =>
    set((state) => ({
      lead: {
        ...state.lead,
        [field]: value,
      },
    })),
}));
