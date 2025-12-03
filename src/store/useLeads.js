// // // // import { create } from "zustand";

// // // // export const useLeads = create((set) => ({
// // // //   leads: [
// // // //     {
// // // //       id: 1,
// // // //       name: "John Doe",
// // // //       company: "TechCorp",
// // // //       email: "john@example.com",
// // // //       phone: "+91 9876543210",
// // // //       source: "Manual",
// // // //       status: "New",
// // // //       createdAt: "2025-12-01",
// // // //       nextFollowUp: "2025-12-05",
// // // //     },
// // // //     {
// // // //       id: 2,
// // // //       name: "Jane Smith",
// // // //       company: "BizSolutions",
// // // //       email: "jane@example.com",
// // // //       phone: "+91 9123456780",
// // // //       source: "CSV Import",
// // // //       status: "Contacted",
// // // //       createdAt: "2025-11-28",
// // // //       nextFollowUp: "2025-12-04",
// // // //     },
// // // //     {
// // // //       id: 3,
// // // //       name: "Robert Brown",
// // // //       company: "InnoTech",
// // // //       email: "robert@innotech.com",
// // // //       phone: "+91 9988776655",
// // // //       source: "Email-to-Lead",
// // // //       status: "Qualified",
// // // //       createdAt: "2025-11-25",
// // // //       nextFollowUp: "2025-12-06",
// // // //     },
// // // //   ],
// // // //   updateLeadStatus: (id, status) =>
// // // //     set((state) => ({
// // // //       leads: state.leads.map((lead) =>
// // // //         lead.id === id ? { ...lead, status } : lead
// // // //       ),
// // // //     })),
// // // // }));
// // // import create from "zustand";
// // // import { useContactsStore } from "./useContactsStore";
// // // import { useCompaniesStore } from "./useCompaniesStore";

// // // export const useLeads = create((set, get) => ({
// // //   leads: [],
// // //   updateLeadStatus: (leadId, newStatus) => {
// // //     const { leads } = get();
// // //     const leadIndex = leads.findIndex((l) => l.id === leadId);
// // //     if (leadIndex === -1) return;

// // //     const updatedLead = { ...leads[leadIndex], status: newStatus };

// // //     set({
// // //       leads: [
// // //         ...leads.slice(0, leadIndex),
// // //         updatedLead,
// // //         ...leads.slice(leadIndex + 1),
// // //       ],
// // //     });

// // //     // --- NEW: Add to Contacts & Companies if Qualified ---
// // //     if (newStatus === "Qualified") {
// // //       const addContact = useContactsStore.getState().addContact;
// // //       const addCompany = useCompaniesStore.getState().addCompany;

// // //       // Add to Contacts
// // //       addContact({
// // //         id: updatedLead.id,
// // //         tenantId: updatedLead.tenantId || "tenant_001",
// // //         name: updatedLead.name,
// // //         company: updatedLead.company,
// // //         email: updatedLead.email,
// // //         phone: updatedLead.phone,
// // //         status: "Active",
// // //         createdAt: new Date().toISOString().split("T")[0],
// // //       });

// // //       // Add to Companies if company exists
// // //       if (updatedLead.company) {
// // //         addCompany({
// // //           id: updatedLead.id,
// // //           tenantId: updatedLead.tenantId || "tenant_001",
// // //           company: updatedLead.company,
// // //           industryType: updatedLead.industryType || "",
// // //           email: updatedLead.email,
// // //           phone: updatedLead.phone,
// // //           status: "Active",
// // //           createdAt: new Date().toISOString().split("T")[0],
// // //         });
// // //       }
// // //     }
// // //   },

// // //   deleteLead: (id) =>
// // //     set((state) => ({
// // //       leads: state.leads.filter((l) => l.id !== id),
// // //     })),
// // // }));
// // import { create } from "zustand";
// // import { useContactsStore } from "./useContactsStore";
// // import { useCompaniesStore } from "./useCompaniesStore";

// // export const useLeads = create((set, get) => ({
// //   leads: [],

// //   updateLeadStatus: (leadId, newStatus) => {
// //     const { leads } = get();
// //     const leadIndex = leads.findIndex((l) => l.id === leadId);
// //     if (leadIndex === -1) return;

// //     const updatedLead = { ...leads[leadIndex], status: newStatus };

// //     // Update the leads array
// //     set({
// //       leads: [
// //         ...leads.slice(0, leadIndex),
// //         updatedLead,
// //         ...leads.slice(leadIndex + 1),
// //       ],
// //     });

// //     // --- Add to Contacts & Companies if Qualified ---
// //     if (newStatus === "Qualified") {
// //       const addContact = useContactsStore.getState().addContact;
// //       const addCompany = useCompaniesStore.getState().addCompany;

// //       const tenantId = updatedLead.tenantId || "tenant_001";

// //       // Add to Contacts
// //       addContact({
// //         id: updatedLead.id,
// //         tenantId,
// //         name: updatedLead.name,
// //         company: updatedLead.company,
// //         email: updatedLead.email,
// //         phone: updatedLead.phone,
// //         status: "Active",
// //         createdAt: new Date().toISOString().split("T")[0],
// //       });

// //       // Add to Companies if company exists
// //       if (updatedLead.company) {
// //         addCompany({
// //           id: updatedLead.id,
// //           tenantId,
// //           company: updatedLead.company,
// //           industryType: updatedLead.industryType || "",
// //           email: updatedLead.email,
// //           phone: updatedLead.phone,
// //           status: "Active",
// //           createdAt: new Date().toISOString().split("T")[0],
// //         });
// //       }

// //       console.log(
// //         `Lead "${updatedLead.name}" added to Contacts & Companies successfully.`
// //       );
// //     }
// //   },

// //   deleteLead: (id) =>
// //     set((state) => ({
// //       leads: state.leads.filter((l) => l.id !== id),
// //     })),
// // }));
// import { create } from "zustand";
// import { useContactsStore } from "./useContactsStore";
// import { useCompaniesStore } from "./useCompaniesStore";

// export const useLeads = create((set, get) => ({
//   // --- Dummy initial leads ---
//   leads: [
//     {
//       id: 1,
//       tenantId: "tenant_001",
//       name: "John Doe",
//       company: "TechCorp",
//       email: "john@techcorp.com",
//       phone: "+91 9876543210",
//       source: "Website",
//       status: "New",
//       nextFollowUp: "2025-12-05",
//       industryType: "Software",
//     },
//     {
//       id: 2,
//       tenantId: "tenant_001",
//       name: "Sarah Wilson",
//       company: "BrightSoft",
//       email: "sarah@brightsoft.io",
//       phone: "+91 9988776655",
//       source: "Referral",
//       status: "Contacted",
//       nextFollowUp: "2025-12-08",
//       industryType: "Consulting",
//     },
//     {
//       id: 3,
//       tenantId: "tenant_001",
//       name: "Mark Lewis",
//       company: "AutoNext",
//       email: "mark@autonext.com",
//       phone: "+91 7766554433",
//       source: "Cold Call",
//       status: "Qualified",
//       nextFollowUp: "2025-12-10",
//       industryType: "Automobile",
//     },
//   ],

//   // --- Update lead status ---
//   updateLeadStatus: (leadId, newStatus) => {
//     const { leads } = get();
//     const leadIndex = leads.findIndex((l) => l.id === leadId);
//     if (leadIndex === -1) return;

//     const updatedLead = { ...leads[leadIndex], status: newStatus };

//     // Update the leads array
//     set({
//       leads: [
//         ...leads.slice(0, leadIndex),
//         updatedLead,
//         ...leads.slice(leadIndex + 1),
//       ],
//     });

//     // --- Add to Contacts & Companies if Qualified ---
//     if (newStatus === "Qualified") {
//       const addContact = useContactsStore.getState().addContact;
//       const addCompany = useCompaniesStore.getState().addCompany;

//       const tenantId = updatedLead.tenantId || "tenant_001";

//       // Add to Contacts
//       addContact({
//         id: updatedLead.id,
//         tenantId,
//         name: updatedLead.name,
//         company: updatedLead.company,
//         email: updatedLead.email,
//         phone: updatedLead.phone,
//         status: "Active",
//         createdAt: new Date().toISOString().split("T")[0],
//       });

//       // Add to Companies if company exists
//       if (updatedLead.company) {
//         addCompany({
//           id: updatedLead.id,
//           tenantId,
//           company: updatedLead.company,
//           industryType: updatedLead.industryType || "",
//           email: updatedLead.email,
//           phone: updatedLead.phone,
//           status: "Active",
//           createdAt: new Date().toISOString().split("T")[0],
//         });
//       }

//       console.log(
//         `Lead "${updatedLead.name}" added to Contacts & Companies successfully.`
//       );
//     }
//   },

//   // --- Delete a lead ---
//   deleteLead: (id) =>
//     set((state) => ({
//       leads: state.leads.filter((l) => l.id !== id),
//     })),

//   // --- Add a new lead manually ---
//   addLead: (lead) =>
//     set((state) => ({
//       leads: [...state.leads, lead],
//     })),
// }));
import { create } from "zustand";
import { useContactsStore } from "./useContactsStore";
import { useCompaniesStore } from "./useCompaniesStore";

export const useLeads = create((set, get) => {
  // --- Dummy initial leads ---
  const initialLeads = [
    {
      id: 1,
      tenantId: "tenant_001",
      name: "John Doe",
      company: "TechCorp",
      email: "john@techcorp.com",
      phone: "+91 9876543210",
      source: "Website",
      status: "New",
      assignedTo:"Staff-2",
      nextFollowUp: "2025-12-05",
      industryType: "Software",
    },
    {
      id: 2,
      tenantId: "tenant_001",
      name: "Sarah Wilson",
      company: "BrightSoft",
      email: "sarah@brightsoft.io",
      phone: "+91 9988776655",
      source: "Referral",
      status: "Contacted",
      assignedTo:"Staff-3",
      nextFollowUp: "2025-12-08",
      industryType: "Consulting",
    },
    {
      id: 3,
      tenantId: "tenant_001",
      name: "Mark Lewis",
      company: "AutoNext",
      email: "mark@autonext.com",
      phone: "+91 7766554433",
      source: "Cold Call",
      status: "Qualified",
      assignedTo:"Staff-1",
      nextFollowUp: "2025-12-10",
      industryType: "Automobile",
    },
  ];

  // --- Immediately add default qualified leads to Contacts/Companies ---
  const addContact = useContactsStore.getState().addContact;
  const addCompany = useCompaniesStore.getState().addCompany;

  initialLeads.forEach((lead) => {
    if (lead.status === "Qualified") {
      const tenantId = lead.tenantId || "tenant_001";

      // Add to Contacts
      addContact({
        id: lead.id,
        tenantId,
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        status: "Active",
        createdAt: new Date().toISOString().split("T")[0],
      });

      // Add to Companies if company exists
      if (lead.company) {
        addCompany({
          id: lead.id,
          tenantId,
          company: lead.company,
          industryType: lead.industryType || "",
          email: lead.email,
          phone: lead.phone,
          status: "Active",
          createdAt: new Date().toISOString().split("T")[0],
        });
      }
    }
  });

  return {
    leads: initialLeads,

    updateLeadStatus: (leadId, newStatus) => {
      const { leads } = get();
      const leadIndex = leads.findIndex((l) => l.id === leadId);
      if (leadIndex === -1) return;

      const updatedLead = { ...leads[leadIndex], status: newStatus };

      // Update the leads array
      set({
        leads: [
          ...leads.slice(0, leadIndex),
          updatedLead,
          ...leads.slice(leadIndex + 1),
        ],
      });

      // --- Add to Contacts & Companies if Qualified ---
      if (newStatus === "Qualified") {
        const addContact = useContactsStore.getState().addContact;
        const addCompany = useCompaniesStore.getState().addCompany;

        const tenantId = updatedLead.tenantId || "tenant_001";

        // Add to Contacts
        addContact({
          id: updatedLead.id,
          tenantId,
          name: updatedLead.name,
          company: updatedLead.company,
          email: updatedLead.email,
          phone: updatedLead.phone,
          status: "Active",
          createdAt: new Date().toISOString().split("T")[0],
        });

        // Add to Companies if company exists
        if (updatedLead.company) {
          addCompany({
            id: updatedLead.id,
            tenantId,
            company: updatedLead.company,
            industryType: updatedLead.industryType || "",
            email: updatedLead.email,
            phone: updatedLead.phone,
            status: "Active",
            createdAt: new Date().toISOString().split("T")[0],
          });
        }

        console.log(
          `Lead "${updatedLead.name}" added to Contacts & Companies successfully.`
        );
      }
    },

    deleteLead: (id) =>
      set((state) => ({
        leads: state.leads.filter((l) => l.id !== id),
      })),
       updateLead: (id, updatedLead) =>
    set((state) => ({
      leads: state.leads.map((lead) =>
        lead.id === id ? { ...lead, ...updatedLead } : lead
      ),
    })),

    addLead: (lead) =>
      set((state) => ({
        leads: [...state.leads, lead],
      })),
  };
});
