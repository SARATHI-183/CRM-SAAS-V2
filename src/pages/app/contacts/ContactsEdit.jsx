import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContactsStore } from "@/store/useContactsStore";
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

export default function ContactsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const getContactById = useContactsStore((state) => state.getContactById);
  const updateContact = useContactsStore((state) => state.updateContact);

  const existing = getContactById(Number(id));

  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "",
    createdAt: "",
  });

  useEffect(() => {
    if (existing) {
      setForm(existing);
    }
  }, [existing]);

  const handleUpdate = () => {
    updateContact(existing.id, form);

    toast.success("Contact updated successfully!");

    navigate("/contacts");
  };

  if (!existing)
    return <h2 className="text-center py-10 text-lg">Contact not found</h2>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card className="shadow-md bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Edit Contact</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">

          {/* NAME */}
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* COMPANY */}
          <div>
            <Label>Company</Label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>

          {/* EMAIL */}
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          {/* PHONE */}
          <div>
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* STATUS */}
          <div>
            <Label>Status</Label>
            <Input
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            />
          </div>

          {/* CREATED AT */}
          <div>
            <Label>Created At</Label>
            <Input
              type="date"
              value={form.createdAt}
              onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate("/contacts")}>
            Cancel
          </Button>
          <Button className="bg-blue-600 text-white" onClick={handleUpdate}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
