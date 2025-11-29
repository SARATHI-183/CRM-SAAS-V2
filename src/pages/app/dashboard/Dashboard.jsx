import TenantAdminLayout from "../../../layouts/TenantAdminLayout";

// 
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Theme Colors
const BLUE = "#3B82F6";
const BLUE_LIGHT = "#93C5FD";
const GRAY = "#6B7280";
const GRAY_LIGHT = "#D1D5DB";

export default function TenantAdminDashboard() {
  // ---------------- Dummy Data ----------------

  // Won / Lost Revenue
  const revenueData = [
    { label: "Won Revenue", amount: 85000 },
    { label: "Lost Revenue", amount: 40000 },
  ];

  // Stats Boxes
  const stats = [
    { title: "Avg Lead Value", value: "₹12,500" },
    { title: "Total Leads", value: "120" },
    { title: "Avg Leads/Day", value: "6" },
    { title: "Total Quotations", value: "45" },
    { title: "Total Persons", value: "80" },
    { title: "Total Organizations", value: "52" },
  ];

  // Vertical Bar — Leads Summary
  const leadsBarData = [
    { name: "Total Leads", value: 120, color: BLUE },
    { name: "Won Leads", value: 70, color: BLUE_LIGHT },
    { name: "Lost Leads", value: 50, color: GRAY },
  ];

  // Top 5 Products
  const topProducts = [
    { name: "CRM Pro", sales: 44 },
    { name: "Marketing Suite", sales: 38 },
    { name: "HR Toolkit", sales: 33 },
    { name: "Billing Engine", sales: 29 },
    { name: "Automation Bot", sales: 20 },
  ];

  // Top 5 Persons
  const topPersons = [
    { name: "John Doe", leads: 22 },
    { name: "Priya Sharma", leads: 18 },
    { name: "Michael Lee", leads: 15 },
    { name: "Aditi Verma", leads: 14 },
    { name: "Chris Wilson", leads: 13 },
  ];

  // Open Leads by Stage
  const stagesData = [
    { stage: "New", value: 45 },
    { stage: "Negotiation", value: 25 },
  ];

  // Revenue by Sources
  const revenueSources = [
    { name: "Direct", value: 55 },
    { name: "Web", value: 25 },
    { name: "Referral", value: 20 },
  ];

  // Revenue by Business Types
  const revenueTypes = [
    { name: "Large Market Business", value: 65 },
    { name: "Existing Business", value: 35 },
  ];

  return (
    <div className="p-6 space-y-6">

      {/* ----------- Revenue Horizontal Bar ----------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={revenueData}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="label" />
              <Tooltip />
              <Bar dataKey="amount" fill={BLUE} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----------- Stats Grid ----------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((item, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardContent className="p-4">
              <p className="text-gray-500">{item.title}</p>
              <p className="text-2xl font-semibold text-blue-700 mt-2">
                {item.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ----------- Leads Summary Vertical Bar ----------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Lead Summary</CardTitle>
        </CardHeader>

        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsBarData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                shape={(props) => (
                  <rect {...props} fill={props.payload.color} />
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----------- Top 5 Section ----------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Top 5 Products</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2 text-gray-700"
              >
                <span>{item.name}</span>
                <span className="font-medium text-blue-600">
                  {item.sales} Sales
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Persons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">Top 5 Persons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPersons.map((item, i) => (
              <div
                key={i}
                className="flex justify-between border-b pb-2 text-gray-700"
              >
                <span>{item.name}</span>
                <span className="font-medium text-blue-600">
                  {item.leads} Leads
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* ----------- Open Leads By Stage ----------- */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-700">Open Leads by Stage</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart layout="vertical" data={stagesData}>
              <XAxis type="number" />
              <YAxis type="category" dataKey="stage" />
              <Tooltip />

              <Bar dataKey="value" fill={BLUE_LIGHT} radius={[4, 4, 4, 4]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----------- Pie Charts Row ----------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Revenue Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">
              Revenue by Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueSources}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell fill={BLUE} />
                  <Cell fill={BLUE_LIGHT} />
                  <Cell fill={GRAY} />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-700">
              Revenue by Business Type
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueTypes}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  <Cell fill={BLUE} />
                  <Cell fill={GRAY} />
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
