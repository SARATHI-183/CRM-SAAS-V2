import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLeads } from "../../../store/useLeads";
import { toast } from "sonner";

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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function LeadsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leads, updateLead } = useLeads();

  const existingLead = leads.find((lead) => lead.id === Number(id));

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    source: "",
    status: "New",
    assignedTo: "",
    nextFollowUp: "",
  });

  useEffect(() => {
    if (existingLead) {
      setForm(existingLead);
    }
  }, [existingLead]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    updateLead(existingLead.id, form);
    toast.success("Lead updated successfully!");
    navigate("/leads");
  };

  if (!existingLead)
    return (
      <h2 className="text-center py-10 text-lg text-red-600">
        Lead not found
      </h2>
    );

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="shadow-md bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Edit Lead</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Name */}
          <div className="space-y-1">
            <Label className="text-gray-700">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter lead name"
            />
          </div>

          {/* Company */}
          <div className="space-y-1">
            <Label className="text-gray-700">Company</Label>
            <Input
              name="company"
              value={form.company}
              onChange={handleChange}
              placeholder="Enter company name"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <Label className="text-gray-700">Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <Label className="text-gray-700">Phone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>

          {/* Source */}
          <div className="space-y-1">
            <Label className="text-gray-700">Source</Label>
            <Input
              name="source"
              value={form.source}
              onChange={handleChange}
              placeholder="Enter lead source"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label className="text-gray-700">Status</Label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Quoted">Quoted</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Assigned To */}
          <div className="space-y-1">
            <Label className="text-gray-700">Assigned To</Label>
            <Input
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              placeholder="Enter assigned person"
            />
          </div>

          {/* Next Follow-Up */}
          <div className="space-y-1">
            <Label className="text-gray-700">Next Follow-Up</Label>
            <Input
              name="nextFollowUp"
              type="date"
              value={form.nextFollowUp}
              onChange={handleChange}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate("/leads")}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdate}
          >
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
