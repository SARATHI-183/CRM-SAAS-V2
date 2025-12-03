
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCompaniesStore } from "../../../store/useCompaniesStore";
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
export default function CompaniesPage() {
  const navigate = useNavigate();
  const companies = useCompaniesStore((state) => state.companies);
  const deleteCompany = useCompaniesStore((state) => state.deleteCompany);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
   const filteredCustomers = companies
  .filter((c) =>
    statusFilter === "All" ? true : c.status === statusFilter
  )
  .filter((c) =>
    search === "" ? true : c.name.toLowerCase().includes(search.toLowerCase())
  );

  const tenantId = "tenant_001";
  const tenantCompanies = companies.filter((c) => c.tenantId === tenantId);

  const filteredCompanies = tenantCompanies
    .filter((c) =>
      search
        ? c.company.toLowerCase().includes(search.toLowerCase()) ||
          c.industryType.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase())
        : true
    )
    .filter((c) =>
      statusFilter === "All" ? true : c.status === statusFilter
    );
   const [page, setPage] = useState(1);
   const [rowsPerPage, setRowsPerPage] = useState(5);
   
   const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage);
   
   const paginatedData = filteredCustomers.slice(
     (page - 1) * rowsPerPage,
     page * rowsPerPage
   );


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800">Companies</h1>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate("/companiesCreate")}
        >
          <Plus size={18} className="mr-2" />
          Add Company
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <Input
            placeholder="Search companies, industry type, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="pl-10"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter size={16} className="mr-2" /> Status
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="bg-white">
            <DropdownMenuItem onClick={() => setStatusFilter("All")}className=" hover:bg-gray-100">
              All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Active")}className=" hover:bg-gray-100">
              Active
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Lead")}className=" hover:bg-gray-100">
              Lead
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}className=" hover:bg-gray-100">
              Inactive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-700">
            All Companies ({filteredCompanies.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 text-sm">
                <TableHead className="px-3 py-2">Company</TableHead>
                <TableHead className="px-3 py-2">Industry Type</TableHead>
                <TableHead className="px-3 py-2">Email</TableHead>
                <TableHead className="px-3 py-2">Phone</TableHead>
                <TableHead className="px-3 py-2">Status</TableHead>
                <TableHead className="px-3 py-2">Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((cust) => (
                  <TableRow key={cust.id}>
                    <TableCell className="font-medium text-gray-800">
                      {cust.company}
                    </TableCell>
                    <TableCell>{cust.industryType}</TableCell>
                    <TableCell>{cust.email}</TableCell>
                    <TableCell>{cust.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          cust.status === "Active"
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
                    <TableCell className="text-right">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex items-center gap-2 bg-white hover:bg-gray-100"
                              onClick={() =>
                                navigate(`/companiesEdit/${cust.id}`)
                              }
                            >
                              <Edit size={16} /> Edit
                            </DropdownMenuItem>

                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600 bg-white hover:bg-gray-100">
                                <Trash size={16} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent className="bg-white hover:bg-gray-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Company?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{" "}
                              <strong>{cust.company}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              type="button"
                              className="bg-red-600 text-white hover:bg-red-700"
                              onClick={() => deleteCompany(cust.id)}
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

       {/* ---------------- Pagination Controls ---------------- */}
      <div className="flex justify-end items-center mt-4 gap-4">
      
        {/* Rows per page dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
      
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1); // reset to first page
            }}
            className="border rounded-md px-2 py-1"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      
        {/* Page Navigation */}
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
