import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react";

export default function CustomersPage() {
  const navigate = useNavigate();

  // Multi-tenant sample data
  const initialData = [
    {
      id: 1,
      tenantId: "tenant_001",
      industryType: "Manufacturing",
      company: "TechCorp",
      email: "john@techcorp.com",
      phone: "+91 9876543210",
      status: "Active",
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      tenantId: "tenant_001",
      industryType:"Healthcare",
      company: "BrightSoft",
      email: "sarah@brightsoft.io",
      phone: "+91 9988776655",
      status: "Lead",
      createdAt: "2025-01-14",
    },
    {
      id: 3,
      tenantId: "tenant_002",
      industryType:"Healthcare",
      company: "AutoNext",
      email: "mark@autonext.com",
      phone: "+91 7766554433",
      status: "Inactive",
      createdAt: "2025-02-01",
    },
    {
      id: 4,
      tenantId: "tenant_002",
      industryType:"Education",
      company: "AutoNext",
      email: "mark@autonext.com",
      phone: "+91 7766554433",
      status: "Inactive",
      createdAt: "2025-02-01",
    },
  ];

  const [customers, setCustomers] = useState(initialData);
  const tenantId = "tenant_001";
  const tenantCustomers = customers.filter((c) => c.tenantId === tenantId);


  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter logic
  const filteredCustomers = tenantCustomers
    .filter((c) =>
      search
        ? c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((c) =>
      statusFilter === "All" ? true : c.status === statusFilter
    );

  // Delete customer handler
  const deleteCustomer = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* ------------------ Header ------------------ */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Companies</h1>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/companiesCreate")}
        >
          <Plus size={18} className="mr-2" />
          Add Companies
        </Button>
      </div>

      {/* ------------------ Filters Card ------------------ */}
      <Card className="shadow-sm">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                placeholder="Search companies,industry type,email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <DropdownMenu >
              <DropdownMenuTrigger asChild >
                <Button variant="outline">
                  <Filter size={16} className="mr-2" /> Status
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className=" bg-white hover:bg-gray-100">
                <DropdownMenuItem onClick={() => setStatusFilter("All")}>
                  All
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Lead")}>
                  Lead
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>
                  Inactive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* ------------------ Table ------------------ */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-700">
            All Companies ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Industry Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell className="font-medium text-gray-800">{cust.company}</TableCell>
                    <TableCell >
                      {cust.industryType}
                    </TableCell>
                    
                    <TableCell>{cust.email}</TableCell>
                    <TableCell>{cust.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${cust.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : cust.status === "Lead"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {cust.status}
                      </span>
                    </TableCell>
                    <TableCell>{cust.createdAt}</TableCell>

                    {/* ACTIONS */}
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            {/* map */}
                            <DropdownMenuItem
                              className="flex items-center gap-2 bg-white hover:bg-gray-100"
                              onClick={() => navigate(`/contactsEdit/${cust.id}`)}
                            >
                              <Edit size={16} /> Edit
                            </DropdownMenuItem>

                            {/* Delete Trigger (INSIDE AlertDialog, INSIDE Dropdown) */}
                            <AlertDialogTrigger asChild >
                              <DropdownMenuItem
                                className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100"
                              >
                                <Trash size={16} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        {/* THE DIALOG CONTENT */}
                        <AlertDialogContent className=" bg-white hover:bg-gray-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Customer?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{cust.name}</strong>?<br />
                            
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              type="button"
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => deleteCustomer(cust.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>

                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
