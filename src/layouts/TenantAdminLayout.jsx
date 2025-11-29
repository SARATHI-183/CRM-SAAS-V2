
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  UserPlus,
  Package,
  FileText,
  ShoppingCart,
  Receipt,
  CreditCard,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
  MessagesSquare,
  Building,
  List,
  ListTodo,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function TenantAdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
 
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [userSettingsOpen, setUserSettingsOpen] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [communicationOpen, setCommunicationOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Contacts", icon: <Users size={18} />, path: "/contacts" },
    { name: "Companies", icon: <Building size={18} />, path: "/companies" },
    { name: "Leads", icon: <UserPlus size={18} />, path: "/leads" },
    { name: "Tasks", icon: <ListTodo size={18} />, path: "/tasks" },
    { name: "Products", icon: <Package size={18} />, path: "/products" },
    { name: "Quotes", icon: <FileText size={18} />, path: "/quotes" },
    { name: "Orders", icon: <ShoppingCart size={18} />, path: "/orders" },
    { name: "Invoices", icon: <Receipt size={18} />, path: "/invoices" },
    { name: "Payments", icon: <CreditCard size={18} />, path: "/payments" },
    { name: "Reports", icon: <BarChart3 size={18} />, path: "/reports" },
    { name: "Activities", icon: <List size={18} />, path: "/activities" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* =============== SIDEBAR =============== */}
      <div
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
    {/* SIDEBAR HEADER */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h1 className="text-xl font-semibold text-blue-700">Tenant Admin</h1>

          {/* Close button on mobile */}
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={22} />
          </Button>
        </div>

        {/* MENU SECTION */}
        <nav className="mt-3 space-y-1 px-4 pb-10">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}

          {/* COMMUNICATION SUITE DROPDOWN */}
<div className="mt-2">
  <button
    onClick={() => setCommunicationOpen(!communicationOpen)}
    className="flex items-center justify-between w-full px-3 py-3 rounded-lg text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
  >
    <span className="flex items-center gap-3">
      <MessagesSquare size={18} />
      <span className="font-medium">Communication</span>
    </span>

    {communicationOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
  </button>

  {communicationOpen && (
    <div className="ml-8 mt-2 space-y-3">

      {/* EMAIL MODULE */}
      <a
        href="/email"
        className="block text-sm text-gray-900 hover:text-blue-700 cursor-pointer"
      >
        Email
      </a>


      {/* WHATSAPP MODULE */}
      <a
        href="/whatsapp"
        className="block text-sm text-gray-900 hover:text-blue-700 cursor-pointer"
      >
        WhatsApp
      </a>

      {/* CALL LOGS MODULE */}
      <a
        href="/calls"
        className="block text-sm text-gray-900 hover:text-blue-700 cursor-pointer"
      >
        IVR
      </a>

    </div>
  )}
</div>


          {/* SETTINGS DROPDOWN */}
          <div className="mt-2">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className="flex items-center justify-between w-full px-3 py-3 rounded-lg 
              text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition"
            >
              <span className="flex items-center gap-3">
                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </span>

              {settingsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {/* SETTINGS EXPANDED */}
            {settingsOpen && (
              <div className="ml-8 mt-2 space-y-3">

                {/* USER SETTINGS DROPDOWN */}
                <button
                  onClick={() => setUserSettingsOpen(!userSettingsOpen)}
                  className="flex justify-between items-center w-full text-sm text-gray-900 hover:text-blue-700"
                >
                  User Settings
                  {userSettingsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {userSettingsOpen && (
                  <div className="ml-4 space-y-2 mt-2">
                    <Link to="/tenantUserCreate" className="block text-gray-900 hover:text-blue-700 text-sm">
                      Tenant User Creation
                    </Link>
                    <Link to="/tenantUserEdit" className="block text-gray-900 hover:text-blue-700 text-sm">
                      Tenant User Edit
                    </Link>
                    <Link to="/tenantUserList" className="block text-gray-900 hover:text-blue-700 text-sm">
                      Tenant User List
                    </Link>
                  </div>
                )}

                {/* SUBSCRIPTION SETTINGS */}
                <button
                  onClick={() => setSubscriptionOpen(!subscriptionOpen)}
                  className="flex justify-between items-center w-full text-sm text-gray-900 hover:text-blue-700"
                >
                  Subscription
                  {subscriptionOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {subscriptionOpen && (
                  <div className="ml-4 space-y-2 mt-2">
                    <Link to="/planDetails" className="block text-gray-900 hover:text-blue-700 text-sm">
                      Plan Details
                    </Link>
                    <Link to="/upgradePlan" className="block text-gray-900 hover:text-blue-700 text-sm">
                      Upgrade Plan
                    </Link>
                  </div>
                )}

                {/* TENANT SETTINGS */}
                <Link
                  to="/tenantSettings"
                  className="block text-gray-900 hover:text-blue-700 text-sm mt-2"
                >
                  Tenant Settings
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* =============== OVERLAY FOR MOBILE =============== */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* =============== MAIN CONTENT AREA =============== */}
      <div className="flex flex-1 flex-col lg:ml-64">

        {/* TOP NAVBAR */}
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </Button>
 {/*=======================SEARCH BAR==========================*/}
          <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
         <div className="flex-1 flex justify-center">
    <div className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          placeholder="Search anything..."
          className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 
          focus:outline-none focus:ring-2 focus:ring-blue-300 
          bg-gray-50 text-gray-700"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-500 absolute left-3 top-2.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 
            7.5 7.5 0 0115 0z"
          />
        </svg>
      </div>
    </div>
  </div>
          <Avatar className="cursor-pointer ring-2 ring-blue-500">
            <AvatarFallback className="bg-blue-600 text-white">TA</AvatarFallback>
          </Avatar>
        </header>

        {/* PAGE CONTENT (Dashboard, Customers, etc.) */}
        <main className="p-6">
          <Outlet />   {/* 🔥 THIS IS REQUIRED FOR ROUTES TO RENDER */}
        </main>
      </div>
    </div>
  );
}
