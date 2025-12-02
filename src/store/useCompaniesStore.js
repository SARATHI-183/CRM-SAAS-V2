// import { create } from "zustand";

// export const useCompaniesStore = create((set, get) => ({
//   companies: [ // your initial default data
//     {
//       id: 1,
//       tenantId: "tenant_001",
      
//       company: "TechCorp",
//       industryType:"IT",
//       email: "john@techcorp.com",
//       phone: "+91 9876543210",
//       status: "Active",
//       createdAt: "2025-01-10",
//     },
//     {
//       id: 2,
//       tenantId: "tenant_001",
//       company: "BrightSoft",
//       industryType: "Manufacturing",
//       email: "sarah@brightsoft.io",
//       phone: "+91 9988776655",
//       status: "Lead",
//       createdAt: "2025-01-14",
//     }],

//   addCompany: (company) =>
//     set((state) => ({
//       companies: [...state.companies, { ...company, id: Date.now() }],
//     })),

//   updateCompany: (id, updated) =>
//     set((state) => ({
//       companies: state.companies.map((c) =>
//         c.id === id ? { ...c, ...updated } : c
//       ),
//     })),

//   deleteCompany: (id) =>
//     set((state) => ({
//       companies: state.companies.filter((c) => c.id !== id),
//     })),

//   getCompanyById: (id) => {
//     return get().companies.find((c) => c.id === Number(id));
//   },
// }));
import { create } from "zustand";

export const useCompaniesStore = create((set) => ({
  companies: [],

  addCompany: (company) =>
    set((state) => ({
      companies: [...state.companies, company],
    })),

  deleteCompany: (id) =>
    set((state) => ({
      companies: state.companies.filter((c) => c.id !== id),
    })),
}));
