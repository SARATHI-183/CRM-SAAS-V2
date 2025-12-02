import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../../store/useLeads";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LeadsCreate() {
  const navigate = useNavigate();
  const { leads, updateLeadStatus, leads: currentLeads, addLead } = useLeads();

  // Form state
  const [form, setForm] = useState({
    name: "",
    company: "",
    industryType:"",
    email: "",
    phone: "",
    source: "",
    status: "New",
    nextFollowUp: "",
    tenantId: "tenant_001",
  });

  const statusOptions = ["New", "Contacted", "Qualified", "Quoted", "Negotiation", "Won", "Lost"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Generate unique ID
    const newLead = { ...form, id: Date.now() };
    addLead(newLead);
    navigate("/leads");
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <Card className="w-full max-w-2xl shadow-md">
        <CardHeader >
          <CardTitle className="text-xl text-gray-800">Add New Lead</CardTitle>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="mt-1"
                required
              />
            </div>

            {/* Company */}
            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
                className="mt-1"
              />
            </div>
            {/* Industry type */}
            <div>
              <Label htmlFor="industryType">Industry Type</Label>
              <Input
                id="industryType"
                name="industryType"
                value={form.industryType}
                onChange={handleChange}
                placeholder="Enter industry type"
                className="mt-1"
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="mt-1"
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="mt-1"
              />
            </div>

            {/* Source */}
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                name="source"
                value={form.source}
                onChange={handleChange}
                placeholder="Enter lead source"
                className="mt-1"
              />
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger id="status" className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Next Follow-Up */}
            <div>
              <Label htmlFor="nextFollowUp">Next Follow-Up</Label>
              <Input
                id="nextFollowUp"
                name="nextFollowUp"
                type="date"
                value={form.nextFollowUp}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <CardFooter className="pt-4">
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/leads")}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
                  Save Lead
                </Button>
              </div>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
