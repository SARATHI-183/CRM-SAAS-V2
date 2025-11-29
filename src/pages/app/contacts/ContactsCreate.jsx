
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// ✅ Added imports for validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ----------------------------------------------------------
// ✅ Yup Validation Schema
// ----------------------------------------------------------
const contactSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  company: yup.string().required("Company is required"),
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(/^[0-9+\-\s]{8,15}$/, "Enter a valid phone number")
    .required("Phone is required"),
  status: yup.string().required("Status is required"),
  createdAt: yup.string().required("Created date is required"),
});

export default function ContactsCreate({ addContact }) {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // ✅ react-hook-form setup with Yup
  // ----------------------------------------------------------
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      status: "Active",
      createdAt: "",
    },
  });

  // ----------------------------------------------------------
  // Submit Handler
  // ----------------------------------------------------------
  const onSubmit = (formData) => {
    const newContact = {
      id: Date.now(),
      tenantId: "tenant_001",
      ...formData,
    };

    addContact(newContact);

    toast.success(`${formData.name} has been successfully added!`, {
      description: "You can now see it in the contacts list.",
    });

    reset();
    navigate("/contacts");
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-md border rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800">Add New Contact</CardTitle>
        </CardHeader>

        {/* Use handleSubmit from react-hook-form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            
            {/* NAME */}
            <div className="space-y-1">
              <Label className="text-gray-600">Name</Label>
              <Input
                placeholder="Enter full name"
                {...register("name")}
                className="focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* COMPANY */}
            <div className="space-y-1">
              <Label className="text-gray-600">Company</Label>
              <Input
                placeholder="Enter company name"
                {...register("company")}
                className="focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.company && (
                <p className="text-red-600 text-sm">{errors.company.message}</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <Label className="text-gray-600">Email</Label>
              <Input
                type="email"
                placeholder="Enter email address"
                {...register("email")}
                className="focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.email && (
                <p className="text-red-600 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <Label className="text-gray-600">Phone</Label>
              <Input
                placeholder="+91 9876543210"
                {...register("phone")}
                className="focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.phone && (
                <p className="text-red-600 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <Label className="text-gray-600">Status</Label>
              <Select
                defaultValue="Active"
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger className="focus:ring-blue-400 focus:border-blue-400">
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Lead">Lead</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              {errors.status && (
                <p className="text-red-600 text-sm">{errors.status.message}</p>
              )}
            </div>

            {/* CREATED AT */}
            <div className="space-y-1">
              <Label className="text-gray-600">Created At</Label>
              <Input
                type="date"
                {...register("createdAt")}
                className="focus:ring-blue-400 focus:border-blue-400"
              />
              {errors.createdAt && (
                <p className="text-red-600 text-sm">{errors.createdAt.message}</p>
              )}
            </div>

          </CardContent>

          <CardFooter className="flex justify-end gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/contacts")}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>

            <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
              Add Contact
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
