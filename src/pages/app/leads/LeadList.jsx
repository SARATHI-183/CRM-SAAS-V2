
// // import React from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useLeads } from "../../../store/useLeads";

// // import {
// //   Card,
// //   CardHeader,
// //   CardTitle,
// //   CardContent,
// // } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";

// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuItem,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu";

// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger,
// // } from "@/components/ui/alert-dialog";

// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";

// // import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

// // const statusColors = {
// //   New: "bg-blue-100 text-blue-800",
// //   Contacted: "bg-gray-100 text-gray-800",
// //   Qualified: "bg-green-100 text-green-800",
// //   Quoted: "bg-purple-100 text-purple-800",
// //   Negotiation: "bg-orange-100 text-orange-800",
// //   Won: "bg-green-800 text-white",
// //   Lost: "bg-red-100 text-red-800",
// // };

// // export default function LeadsPage() {
// //   const navigate = useNavigate();
// //   const { leads, updateLeadStatus, deleteLead } = useLeads();


// //   return (
// //     <div className="p-6 bg-gray-50 min-h-screen">
// //       <Card className="bg-white shadow-md">
// //         {/* Header */}
// //         <CardHeader className="flex  items-center ">
// //           <CardTitle className="text-xl text-gray-800">Leads</CardTitle>

// //           {/* Create Lead Button */}
// //           <Button 
// //             onClick={() => navigate("/leadsCreate")}
// //             className="ml-auto bg-blue-600 text-white hover:bg-blue-700 "
// //           >
// //             + New Lead
// //           </Button>
// //         </CardHeader>

// //         {/* Table */}
// //         <CardContent>
// //           <div className="overflow-x-auto">
// //             <table className="w-full text-left table-auto border-collapse">
// //               <thead>
// //                 <tr className="bg-gray-100 text-sm">
// //                   <th className="px-3 py-2">Name</th>
// //                   <th className="px-3 py-2">Company</th>
// //                   <th className="px-3 py-2">Email</th>
// //                   <th className="px-3 py-2">Phone</th>
// //                   <th className="px-3 py-2">Source</th>
// //                   <th className="px-3 py-2">Status</th>
// //                    <th className="px-3 py-2">Assigned To</th>
// //                   <th className="px-3 py-2">Next Follow-Up</th>
// //                   <th className="px-3 py-2 text-center">Actions</th>
// //                 </tr>
// //               </thead>

// //               <tbody>
// //                 {leads.map((lead) => (
// //                   <tr
// //                     key={lead.id}
// //                     className="border-b text-sm hover:bg-gray-50"
// //                     style={{ height: "38px" }} // smaller row height like excel
// //                   >
// //                     <td className="px-1 py-1">{lead.name}</td>
// //                     <td className="px-1 py-1">{lead.company}</td>
// //                     <td className="px-1 py-1">{lead.email}</td>
// //                     <td className="px-1 py-1">{lead.phone}</td>
// //                     <td className="px-1 py-1">{lead.source}</td>

// //                     {/* Status Selector */}
// //                     <td className="px-1 py-1">
// //                       <Select
// //                         value={lead.status}
// //                         onValueChange={(value) =>
// //                           updateLeadStatus(lead.id, value)
// //                         }
// //                       >
// //                         <SelectTrigger className="w-32 h-8">
// //                           <SelectValue placeholder="Status" />
// //                         </SelectTrigger>
// //                         <SelectContent className="bg-white">
// //                           {Object.keys(statusColors).map((status) => (
// //                             <SelectItem key={status} value={status}>
// //                               {status}
// //                             </SelectItem>
// //                           ))}
// //                         </SelectContent>
// //                       </Select>

// //                       <div
// //                         className={`mt-1 w-max px-2  rounded text-xs ${statusColors[lead.status]}`}
// //                       >
// //                         {lead.status}
// //                       </div>
// //                     </td>
// //                     <td className="px-3 py-2">{lead.assignedTo}</td>
// //                     <td className="px-3 py-2">{lead.nextFollowUp}</td>

// //                     {/* Actions Menu */}
// //                     <td className="px-3 py-2 text-center">
// //                       <DropdownMenu>
// //                         <DropdownMenuTrigger>
// //                           <MoreHorizontal className="cursor-pointer" />
// //                         </DropdownMenuTrigger>

// //                         <DropdownMenuContent className="bg-white">
// //                           {/* Show Lead */}
// //                           <DropdownMenuItem
// //                             className="flex items-center gap-2 bg-white hover:bg-gray-100"
// //                             onClick={() => navigate(`/leads/${lead.id}`)}
// //                           >
// //                             <Eye size={16} /> Show
// //                           </DropdownMenuItem>

// //                           {/* Edit Lead */}
// //                           <DropdownMenuItem
// //                             className="flex items-center gap-2 bg-white hover:bg-gray-100"
// //                             onClick={() => navigate(`/leadsEdit/${lead.id}`)}
// //                           >
// //                             <Edit size={16} /> Edit
// //                           </DropdownMenuItem>

// //                           {/* Delete Lead */}
// //                           <AlertDialog>
// //                             <AlertDialogTrigger asChild>
// //                               <DropdownMenuItem className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100">
// //                                 <Trash size={16} /> Delete
// //                               </DropdownMenuItem>
// //                             </AlertDialogTrigger>

// //                             <AlertDialogContent className="bg-white">
// //                               <AlertDialogHeader>
// //                                 <AlertDialogTitle>
// //                                   Delete Lead?
// //                                 </AlertDialogTitle>
// //                                 <AlertDialogDescription>
// //                                   Are you sure you want to delete{" "}
// //                                   <strong>{lead.name}</strong>?
// //                                 </AlertDialogDescription>
// //                               </AlertDialogHeader>

// //                               <AlertDialogFooter>
// //                                 <AlertDialogCancel>
// //                                   Cancel
// //                                 </AlertDialogCancel>

// //                                 <AlertDialogAction
// //                                   className="bg-red-600 text-white hover:bg-red-700"
// //                                   onClick={() => deleteLead(lead.id)}
// //                                 >
// //                                   Delete
// //                                 </AlertDialogAction>
// //                               </AlertDialogFooter>
// //                             </AlertDialogContent>
// //                           </AlertDialog>
// //                         </DropdownMenuContent>
// //                       </DropdownMenu>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </CardContent>
// //       </Card>
// //       {/* Page Navigation */}
// //         <div className="flex items-center gap-2">

// //           <Button
// //             variant="outline"
// //             size="sm"
// //             disabled={page === 1}
// //             onClick={() => setPage(page - 1)}
// //           >
// //             Prev
// //           </Button>

// //           <span className="text-sm text-gray-700">
// //             Page {page} of {totalPages}
// //           </span>

// //           <Button
// //             variant="outline"
// //             size="sm"
// //             disabled={page === totalPages}
// //             onClick={() => setPage(page + 1)}
// //           >
// //             Next
// //           </Button>

// //         </div>
// //       </div>

// //   );
// // }
// import React, { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { useLeads } from "../../../store/useLeads";

// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";

// import { MoreHorizontal, Eye, Edit, Trash, Search } from "lucide-react";

// const statusColors = {
//   New: "bg-blue-100 text-blue-800",
//   Contacted: "bg-gray-100 text-gray-800",
//   Qualified: "bg-green-100 text-green-800",
//   Quoted: "bg-purple-100 text-purple-800",
//   Negotiation: "bg-orange-100 text-orange-800",
//   Won: "bg-green-800 text-white",
//   Lost: "bg-red-100 text-red-800",
// };

// export default function LeadsPage() {
//   const navigate = useNavigate();
//   const { leads, updateLeadStatus, deleteLead } = useLeads();

//   // Search, filters, pagination state
//   const [search, setSearch] = useState("");
//   const [filterSource, setFilterSource] = useState("All");
//   const [filterStatus, setFilterStatus] = useState("All");
//   const [filterAssigned, setFilterAssigned] = useState("All");

//   const [page, setPage] = useState(1);
//   const rowsPerPage = 5;

//   // Filtering + Search Logic
//   const filteredLeads = useMemo(() => {
//     return leads
//       .filter((lead) =>
//         `${lead.name} ${lead.company} ${lead.email} ${lead.phone}`
//           .toLowerCase()
//           .includes(search.toLowerCase())
//       )
//       .filter((lead) =>
//         filterSource === "All" ? true : lead.source === filterSource
//       )
//       .filter((lead) =>
//         filterStatus === "All" ? true : lead.status === filterStatus
//       )
//       .filter((lead) =>
//         filterAssigned === "All" ? true : lead.assignedTo === filterAssigned
//       );
//   }, [leads, search, filterSource, filterStatus, filterAssigned]);

//   // Pagination
//   const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

//   const paginatedData = filteredLeads.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   // Reset to page 1 when filters/search change
//   React.useEffect(() => setPage(1), [search, filterSource, filterStatus, filterAssigned]);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <Card className="bg-white shadow-md">

//         {/* Header */}
//         <CardHeader className="flex items-center gap-3">
//           <CardTitle className="text-xl text-gray-800">Leads</CardTitle>

//           <Button
//             onClick={() => navigate("/leadsCreate")}
//             className="ml-auto bg-blue-600 text-white hover:bg-blue-700 "
//           >
//             + New Lead
//           </Button>
//         </CardHeader>

//         {/* Search + Filters */}
//         <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-4 gap-3">

//           {/* Search Input */}
//           <div className="relative">
//             <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
//             <Input
//               placeholder="Search name, email, phone, company..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               className="pl-9"
//             />
//           </div>

//           {/* Source Filter */}
//           <Select value={filterSource} onValueChange={setFilterSource}>
//             <SelectTrigger>
//               <SelectValue placeholder="Source" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="All">All Sources</SelectItem>
//               <SelectItem value="Website">Website</SelectItem>
//               <SelectItem value="Referral">Referral</SelectItem>
//               <SelectItem value="Instagram">Instagram</SelectItem>
//               <SelectItem value="Facebook">Facebook</SelectItem>
//               <SelectItem value="Cold Call">Cold Call</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Status Filter */}
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger>
//               <SelectValue placeholder="Status" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="All">All Status</SelectItem>
//               {Object.keys(statusColors).map((s) => (
//                 <SelectItem key={s} value={s}>
//                   {s}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>

//           {/* Assigned To Filter */}
//           <Select value={filterAssigned} onValueChange={setFilterAssigned}>
//             <SelectTrigger>
//               <SelectValue placeholder="Assigned To" />
//             </SelectTrigger>
//             <SelectContent className="bg-white">
//               <SelectItem value="All">All Users</SelectItem>
//               {Array.from(new Set(leads.map((l) => l.assignedTo))).map(
//                 (user) => (
//                   <SelectItem key={user} value={user}>
//                     {user}
//                   </SelectItem>
//                 )
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Table */}
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left table-auto border-collapse">
//               <thead>
//                 <tr className="bg-gray-100 text-sm">
//                   <th className="px-3 py-2">Name</th>
//                   <th className="px-3 py-2">Company</th>
//                   <th className="px-3 py-2">Email</th>
//                   <th className="px-3 py-2">Phone</th>
//                   <th className="px-3 py-2">Source</th>
//                   <th className="px-3 py-2">Status</th>
//                   <th className="px-3 py-2">Assigned To</th>
//                   <th className="px-3 py-2">Next Follow-Up</th>
//                   <th className="px-3 py-2 text-center">Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {paginatedData.map((lead) => (
//                   <tr
//                     key={lead.id}
//                     className="border-b text-sm hover:bg-gray-50"
//                     style={{ height: "38px" }}
//                   >
//                     <td className="px-1 py-1">{lead.name}</td>
//                     <td className="px-1 py-1">{lead.company}</td>
//                     <td className="px-1 py-1">{lead.email}</td>
//                     <td className="px-1 py-1">{lead.phone}</td>
//                     <td className="px-1 py-1">{lead.source}</td>

//                     {/* Status select */}
//                     <td className="px-1 py-1">
//                       <Select
//                         value={lead.status}
//                         onValueChange={(value) =>
//                           updateLeadStatus(lead.id, value)
//                         }
//                       >
//                         <SelectTrigger className="w-32 h-8">
//                           <SelectValue placeholder="Status" />
//                         </SelectTrigger>
//                         <SelectContent className="bg-white">
//                           {Object.keys(statusColors).map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>

//                       <div
//                         className={`mt-1 w-max px-2 rounded text-xs ${statusColors[lead.status]}`}
//                       >
//                         {lead.status}
//                       </div>
//                     </td>

//                     <td className="px-3 py-2">{lead.assignedTo}</td>
//                     <td className="px-3 py-2">{lead.nextFollowUp}</td>

//                     {/* Actions */}
//                     <td className="px-3 py-2 text-center">
//                       <DropdownMenu>
//                         <DropdownMenuTrigger>
//                           <MoreHorizontal className="cursor-pointer" />
//                         </DropdownMenuTrigger>

//                         <DropdownMenuContent className="bg-white">
//                           <DropdownMenuItem
//                             className="flex items-center gap-2 bg-white hover:bg-gray-100"
//                             onClick={() => navigate(`/leads/${lead.id}`)}
//                           >
//                             <Eye size={16} /> Show
//                           </DropdownMenuItem>

//                           <DropdownMenuItem
//                             className="flex items-center gap-2 bg-white hover:bg-gray-100"
//                             onClick={() =>
//                               navigate(`/leadsEdit/${lead.id}`)
//                             }
//                           >
//                             <Edit size={16} /> Edit
//                           </DropdownMenuItem>

//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <DropdownMenuItem className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100">
//                                 <Trash size={16} /> Delete
//                               </DropdownMenuItem>
//                             </AlertDialogTrigger>

//                             <AlertDialogContent className="bg-white">
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>
//                                   Delete Lead?
//                                 </AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   Delete{" "}
//                                   <strong>{lead.name}</strong>?
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>

//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>
//                                   Cancel
//                                 </AlertDialogCancel>

//                                 <AlertDialogAction
//                                   className="bg-red-600 text-white hover:bg-red-700"
//                                   onClick={() => deleteLead(lead.id)}
//                                 >
//                                   Delete
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </DropdownMenuContent>
//                       </DropdownMenu>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Pagination */}
//       <div className="flex items-center gap-4 mt-4">
//         <Button
//           variant="outline"
//           size="sm"
//           disabled={page === 1}
//           onClick={() => setPage(page - 1)}
//         >
//           Prev
//         </Button>

//         <span className="text-sm text-gray-700">
//           Page {page} of {totalPages}
//         </span>

//         <Button
//           variant="outline"
//           size="sm"
//           disabled={page === totalPages}
//           onClick={() => setPage(page + 1)}
//         >
//           Next
//         </Button>
//       </div>
//     </div>
//   );
// }
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../../store/useLeads";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { MoreHorizontal, Eye, Edit, Trash, Search, Filter } from "lucide-react";

const statusColors = {
  New: "bg-blue-100 text-blue-800",
  Contacted: "bg-gray-100 text-gray-800",
  Qualified: "bg-green-100 text-green-800",
  Quoted: "bg-purple-100 text-purple-800",
  Negotiation: "bg-orange-100 text-orange-800",
  Won: "bg-green-800 text-white",
  Lost: "bg-red-100 text-red-800",
};

export default function LeadsPage() {
  const navigate = useNavigate();
  const { leads, updateLeadStatus, deleteLead } = useLeads();

  // Search, filters, pagination state
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAssigned, setFilterAssigned] = useState("All");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Filtering + Search Logic
  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) =>
        `${lead.name} ${lead.company} ${lead.email} ${lead.phone}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
      .filter((lead) =>
        filterSource === "All" ? true : lead.source === filterSource
      )
      .filter((lead) =>
        filterStatus === "All" ? true : lead.status === filterStatus
      )
      .filter((lead) =>
        filterAssigned === "All" ? true : lead.assignedTo === filterAssigned
      );
  }, [leads, search, filterSource, filterStatus, filterAssigned]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  const paginatedData = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Reset page when filters/search changes
  React.useEffect(() => setPage(1), [
    search,
    filterSource,
    filterStatus,
    filterAssigned,
    rowsPerPage,
  ]);

  return (
   
    <div className=" bg-gray-50 min-h-screen">


      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Leads</h1>
        <Button
          onClick={() => navigate("/leadsCreate")}
          className="ml-auto bg-blue-600 text-white hover:bg-blue-700"
        >
          + New Lead
        </Button>
      </div>




      {/* Search + Filter Button */}
      <div className=" pb-4 flex items-center gap-3 mt-4">

        {/* Search Input */}
        <div className="relative w-full ">
          <Search className="absolute left-3 top-3  text-gray-500" size={18} />
          <Input
            placeholder="Search name, email, phone, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Compact Filters Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="bg-gray-200 text-gray-700 hover:bg-gray-300"
              variant="outline"
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="p-3 space-y-3 bg-white">

            {/* Source Filter */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Source</label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" bg-white">
                  <SelectItem value="All"className="hover:bg-gray-100">All</SelectItem>
                  <SelectItem value="Website"className="hover:bg-gray-100">Website</SelectItem>
                  <SelectItem value="Referral"className="hover:bg-gray-100">Referral</SelectItem>
                  <SelectItem value="Instagram"className="hover:bg-gray-100">Instagram</SelectItem>
                  <SelectItem value="Facebook"className="hover:bg-gray-100">Facebook</SelectItem>
                  <SelectItem value="Cold Call"className="hover:bg-gray-100">Cold Call</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" bg-white">
                  <SelectItem value="All"className="hover:bg-gray-100">All</SelectItem>
                  {Object.keys(statusColors).map((s) => (
                    <SelectItem key={s} value={s}className="hover:bg-gray-100">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Assigned Filter */}
            <div className="space-y-1">
              <label className="text-xs text-gray-600">Assigned To</label>
              <Select
                value={filterAssigned}
                onValueChange={setFilterAssigned}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className=" bg-white">
                  <SelectItem value="All"className="hover:bg-gray-100">All</SelectItem>
                  {Array.from(new Set(leads.map((l) => l.assignedTo))).map(
                    (user) => (
                      <SelectItem key={user} value={user}className="hover:bg-gray-100">
                        {user}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>





      <Card className="bg-white shadow-md ">
        <CardHeader >
          <CardTitle className="text-xl text-gray-800"> All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        {/* Table */}
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Company</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Source</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Assigned To</th>
                  <th className="px-3 py-2">Next Follow-Up</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b text-sm hover:bg-gray-50"
                    style={{ height: "38px" }}
                  >
                    <td className="px-1 py-1">{lead.name}</td>
                    <td className="px-1 py-1">{lead.company}</td>
                    <td className="px-1 py-1">{lead.email}</td>
                    <td className="px-1 py-1">{lead.phone}</td>
                    <td className="px-1 py-1">{lead.source}</td>

                    {/* Status */}
                    <td className="px-1 py-1">
                      <Select
                        value={lead.status}
                        onValueChange={(val) =>
                          updateLeadStatus(lead.id, val)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white"> 
                          {Object.keys(statusColors).map((s) => (
                            <SelectItem key={s} value={s} className="hover:bg-gray-50">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div
                        className={`mt-1 w-max px-2 rounded text-xs ${statusColors[lead.status]}`}
                      >
                        {lead.status}
                      </div>
                    </td>

                    <td className="px-3 py-2">{lead.assignedTo}</td>
                    <td className="px-3 py-2">{lead.nextFollowUp}</td>

                    {/* Actions Menu */}
                    <td className="px-3 py-2 text-center">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="bg-white">
                            {/* Show */}
                            <DropdownMenuItem
                              className="flex items-center gap-2 bg-white hover:bg-gray-100"
                              onClick={() => navigate(`/leadDetails/${lead.id}`)}
                            >
                              <Eye size={16} /> Show
                            </DropdownMenuItem>

                            {/* Edit */}
                            <DropdownMenuItem
                              className="flex items-center gap-2 bg-white hover:bg-gray-100"
                              onClick={() => navigate(`/leadsEdit/${lead.id}`)}
                            >
                              <Edit size={16} /> Edit
                            </DropdownMenuItem>

                            {/* Delete */}
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100">
                                <Trash size={16} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Delete Confirmation Dialog */}
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Lead?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{lead.name}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter className="flex gap-2">
                            <AlertDialogCancel className="border px-4 py-2 rounded hover:bg-gray-100">
                              Cancel
                            </AlertDialogCancel>

                            <AlertDialogAction
                              type="button"
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                              onClick={() => {
                                deleteLead(lead.id); // Delete from store
                                toast.success(`${lead.name} deleted successfully!`); // Show toast
                              }}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-4">

        {/* Rows Per Page */}
        <Select
          value={String(rowsPerPage)}
          onValueChange={(v) => setRowsPerPage(Number(v))}
        >
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Rows" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </Button>

          <span className="text-sm text-gray-700">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
    
  );
}
