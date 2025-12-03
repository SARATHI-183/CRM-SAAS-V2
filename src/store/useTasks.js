import { create } from "zustand";
import { useLeads } from "./useLeads";

export const useTasks = create((set, get) => {
  const leads = useLeads.getState().leads;

  // --- Dummy initial tasks ---
  const initialTasks = [
    {
      id: 1,
      title: "Follow up with John",
      description: "Call John about his software requirements",
      assignedTo: leads[0]?.assignedTo || "Staff-1",
      dueDate: "2025-12-05",
      status: "Pending",
      priority: "High",
      project: "CRM Implementation",
    },
    {
      id: 2,
      title: "Send proposal to Sarah",
      description: "Email proposal with pricing and timeline",
      assignedTo: leads[1]?.assignedTo || "Staff-2",
      dueDate: "2025-12-06",
      status: "In Progress",
      priority: "Medium",
      project: "Website Redesign",
    },
    {
      id: 3,
      title: "Demo for Mark",
      description: "Schedule product demo call with Mark",
      assignedTo: leads[2]?.assignedTo || "Staff-3",
      dueDate: "2025-12-07",
      status: "Pending",
      priority: "High",
      project: "Automobile CRM",
    },
  ];

  return {
    tasks: initialTasks,

    addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
    updateTask: (id, updatedTask) =>
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        ),
      })),
    deleteTask: (id) =>
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
  };
});
