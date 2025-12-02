// import React from "react";
// import { useLeads } from "../../../store/useLeads";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
//   const { leads, updateLeadStatus } = useLeads();

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <Card className="bg-white shadow-md">
//         <CardHeader>
//           <CardTitle className="text-xl text-gray-800">Leads</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="overflow-x-auto">
//             <table className="w-full text-left table-auto">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="px-4 py-2">Name</th>
//                   <th className="px-4 py-2">Company</th>
//                   <th className="px-4 py-2">Email</th>
//                   <th className="px-4 py-2">Phone</th>
//                   <th className="px-4 py-2">Source</th>
//                   <th className="px-4 py-2">Status</th>
//                   <th className="px-4 py-2">Next Follow-Up</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leads.map((lead) => (
//                   <tr key={lead.id} className="border-b">
//                     <td className="px-4 py-2 text-gray-700">{lead.name}</td>
//                     <td className="px-4 py-2 text-gray-700">{lead.company}</td>
//                     <td className="px-4 py-2 text-gray-700">{lead.email}</td>
//                     <td className="px-4 py-2 text-gray-700">{lead.phone}</td>
//                     <td className="px-4 py-2 text-gray-700">{lead.source}</td>
//                     <td className="px-4 py-2">
//                       <Select 
//                         value={lead.status}
//                         onValueChange={(value) => updateLeadStatus(lead.id, value)}
//                       >
//                         <SelectTrigger className="w-32">
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                         <SelectContent className=" bg-white hover:bg-gray-100">
//                           {Object.keys(statusColors).map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <div className={`mt-1 w-max px-2 py-1 rounded text-sm ${statusColors[lead.status]}`}>
//                         {lead.status}
//                       </div>
//                     </td>
//                     <td className="px-4 py-2 text-gray-700">{lead.nextFollowUp}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../../store/useLeads";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MoreHorizontal, Eye, Edit, Trash } from "lucide-react";

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Card className="bg-white shadow-md">
        {/* Header */}
        <CardHeader className="flex  items-center ">
          <CardTitle className="text-xl text-gray-800">Leads</CardTitle>

          {/* Create Lead Button */}
          <Button 
            onClick={() => navigate("/leadsCreate")}
            className="ml-auto bg-blue-600 text-white hover:bg-blue-700 "
          >
            + New Lead
          </Button>
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
                  <th className="px-3 py-2">Next Follow-Up</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="border-b text-sm hover:bg-gray-50"
                    style={{ height: "38px" }} // smaller row height like excel
                  >
                    <td className="px-1 py-1">{lead.name}</td>
                    <td className="px-1 py-1">{lead.company}</td>
                    <td className="px-1 py-1">{lead.email}</td>
                    <td className="px-1 py-1">{lead.phone}</td>
                    <td className="px-1 py-1">{lead.source}</td>

                    {/* Status Selector */}
                    <td className="px-1 py-1">
                      <Select
                        value={lead.status}
                        onValueChange={(value) =>
                          updateLeadStatus(lead.id, value)
                        }
                      >
                        <SelectTrigger className="w-32 h-8">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {Object.keys(statusColors).map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <div
                        className={`mt-1 w-max px-2  rounded text-xs ${statusColors[lead.status]}`}
                      >
                        {lead.status}
                      </div>
                    </td>

                    <td className="px-3 py-2">{lead.nextFollowUp}</td>

                    {/* Actions Menu */}
                    <td className="px-3 py-2 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <MoreHorizontal className="cursor-pointer" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent className="bg-white">
                          {/* Show Lead */}
                          <DropdownMenuItem
                            className="flex items-center gap-2 bg-white hover:bg-gray-100"
                            onClick={() => navigate(`/leads/${lead.id}`)}
                          >
                            <Eye size={16} /> Show
                          </DropdownMenuItem>

                          {/* Edit Lead */}
                          <DropdownMenuItem
                            className="flex items-center gap-2 bg-white hover:bg-gray-100"
                            onClick={() => navigate(`/leadsEdit/${lead.id}`)}
                          >
                            <Edit size={16} /> Edit
                          </DropdownMenuItem>

                          {/* Delete Lead */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100">
                                <Trash size={16} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent className="bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Lead?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete{" "}
                                  <strong>{lead.name}</strong>?
                                </AlertDialogDescription>
                              </AlertDialogHeader>

                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Cancel
                                </AlertDialogCancel>

                                <AlertDialogAction
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => deleteLead(lead.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
