// src/pages/LeadDetails.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useLeadDetails } from "@/store/useLeadDetails";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function LeadDetails() {
  const { id } = useParams();
  const { lead, fetchLeadById } = useLeadDetails();

  useEffect(() => {
    fetchLeadById(id);
  }, [id]);

  if (!lead) {
    return (
      <div className="p-6 text-gray-600 text-lg">
        Loading lead details...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Card */}
        <Card className="border-blue-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl flex justify-between items-center">
              {lead.name}
              <Badge className="bg-blue-600 text-white">{lead.status}</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Company</p>
              <p className="font-medium text-gray-800">{lead.company}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{lead.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">{lead.phone}</p>
            </div>

            <div>
              <p className="text-gray-500">Source</p>
              <p className="font-medium text-gray-800">{lead.source}</p>
            </div>

            <div>
              <p className="text-gray-500">Assigned To</p>
              <p className="font-medium text-gray-800">{lead.assignedTo}</p>
            </div>

            <div>
              <p className="text-gray-500">Industry Type</p>
              <p className="font-medium text-gray-800">{lead.industryType}</p>
            </div>

            <div>
              <p className="text-gray-500">Next Follow Up</p>
              <p className="font-medium text-gray-800">{lead.nextFollowUp}</p>
            </div>

            <div>
              <p className="text-gray-500">Tenant ID</p>
              <p className="font-medium text-gray-800">{lead.tenantId}</p>
            </div>
          </CardContent>
        </Card>

        {/* Activity / Notes / Other Sections (optional) */}
        <Card className="shadow">
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          
        </Card>

      </div>
    </div>
  );
}
