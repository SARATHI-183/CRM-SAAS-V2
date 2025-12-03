import React, { useState, useMemo } from "react";
import { useTasks } from "../../../store/useTasks";
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

import { MoreHorizontal, Edit, Trash, Search, Filter, Eye } from "lucide-react";

export default function TasksPage() {
  const { tasks, deleteTask } = useTasks();
  const leads = useLeads().leads;

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAssigned, setFilterAssigned] = useState("All");

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) =>
        `${t.title} ${t.description} ${t.project}`.toLowerCase().includes(search.toLowerCase())
      )
      .filter((t) => filterStatus === "All" ? true : t.status === filterStatus)
      .filter((t) => filterAssigned === "All" ? true : t.assignedTo === filterAssigned);
  }, [tasks, search, filterStatus, filterAssigned]);
   // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage));

  const paginatedData = filteredLeads.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          + New Task
        </Button>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mb-4">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-3 text-gray-500" size={18} />
          <Input
            className="pl-9"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="All"className="hover:bg-gray-100">All</SelectItem>
            <SelectItem value="Pending"className="hover:bg-gray-100">Pending</SelectItem>
            <SelectItem value="In Progress"className="hover:bg-gray-100">In Progress</SelectItem>
            <SelectItem value="Completed"className="hover:bg-gray-100">Completed</SelectItem>
            <SelectItem value="Overdue"className="hover:bg-gray-100">Overdue</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAssigned} onValueChange={setFilterAssigned}>
          <SelectTrigger className="w-40 h-10">
            <SelectValue placeholder="Assigned To" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="All"className="hover:bg-gray-100">All</SelectItem>
            {Array.from(new Set(leads.map((l) => l.assignedTo))).map((user) => (
              <SelectItem key={user} value={user}className="hover:bg-gray-100">{user}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        </DropdownMenuContent>
                </DropdownMenu>
        

        
      </div>

      <Card className="bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">All Tasks ({filteredTasks.length})</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto border-collapse">
              <thead>
                <tr className="bg-gray-100 text-sm">
                  <th className="px-3 py-2">Title</th>
                  <th className="px-3 py-2">Assigned To</th>
                  <th className="px-3 py-2">Due Date</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Priority</th>
                  <th className="px-3 py-2">Project</th>
                  <th className="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="border-b text-sm hover:bg-gray-50">
                    <td className="px-3 py-2">{task.title}</td>
                    <td className="px-3 py-2">{task.assignedTo}</td>
                    <td className="px-3 py-2">{task.dueDate}</td>
                    <td className="px-3 py-2">{task.status}</td>
                    <td className="px-3 py-2">{task.priority}</td>
                    <td className="px-3 py-2">{task.project}</td>

                    {/* Actions */}
                    <td className="px-3 py-2 text-center">
                      <AlertDialog>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={18} />
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent align="end" className="bg-white">
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => alert("View " + task.title)}>
                              <Eye size={16} /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2" onClick={() => alert("Edit " + task.title)}>
                              <Edit size={16} /> Edit
                            </DropdownMenuItem>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash size={16} /> Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete <strong>{task.title}</strong>?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex gap-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteTask(task.id)}>Delete</AlertDialogAction>
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
