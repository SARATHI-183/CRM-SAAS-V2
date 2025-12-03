import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCompaniesStore } from "../../../store/useCompaniesStore";
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

export default function CompaniesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getCompanyById = useCompaniesStore((state) => state.getCompanyById);
  const updateCompany = useCompaniesStore((state) => state.updateCompany);

 const company = getCompanyById(Number(id));

  const [form, setForm] = useState({
    company: "",
    industryType: "",
    email: "",
    phone: "",
    status: "Active",
    createdAt: "",
  });

  useEffect(() => {
    if (company) {
      setForm({
        company: company.company || "",
        industryType: company.industryType || "",
        email: company.email || "",
        phone: company.phone || "",
        status: company.status || "Active",
        createdAt: company.createdAt || "",
      });
    }
  }, [company]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCompany(company.id, form);
    toast.success(`${form.company} updated successfully!`);
    navigate("/companies");
  };

  if (!company)
    return <h2 className="text-center text-red-600">Company Not Found</h2>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-md border rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Edit Company</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* COMPANY */}
            <div className="space-y-1">
              <Label className="text-gray-600">Company</Label>
              <Input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Enter company name"
              />
            </div>

            {/* INDUSTRY TYPE */}
            <div className="space-y-1">
              <Label className="text-gray-600">Industry Type</Label>
              <Input
                name="industryType"
                value={form.industryType}
                onChange={handleChange}
                placeholder="Enter industry type"
              />
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label className="text-gray-600">Email</Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <Label className="text-gray-600">Phone</Label>
              <Input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <Label className="text-gray-600">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* CREATED AT */}
            <div className="space-y-1">
              <Label className="text-gray-600">Created At</Label>
              <Input
                type="date"
                name="createdAt"
                value={form.createdAt}
                onChange={handleChange}
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/companies")}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
