
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import TenantAdminLayout from "../layouts/TenantAdminLayout";

// Pages
import Dashboard from "../pages/app/dashboard/Dashboard";
import Contacts from "../pages/app/contacts/ContactsList";
import ContactsCreate from "../pages/app/contacts/ContactsCreate";
import ContactsEdit from "../pages/app/contacts/ContactsEdit";

import Leads from "../pages/app/leads/LeadList";
import Products from "../pages/app/products/ProductList";
import Quotes from "../pages/app/quotes/QuoteList";
import Orders from "../pages/app/orders/OrderList";
import Invoices from "../pages/app/invoices/InvoiceList";
import Payments from "../pages/app/payments/paymentsList";
import Reports from "../pages/app/reports/CustomerReport";
import TenantUserCreate from "../pages/tenantAdmin/Users/TenantUserCreate";
import TenantUserEdit from "../pages/tenantAdmin/Users/TenantUserEdit";
import TenantUserList from "../pages/tenantAdmin/Users/TenantUserList";
import PlanDetails from "../pages/tenantAdmin/Subscription/PlanDetails";
import UpgradePlan from "../pages/tenantAdmin/Subscription/UpgradePlan";
import TenantSettings from "../pages/tenantAdmin/Settings/TenantSettings";
import Ivr from "../pages/app/CommunicationSuite/Ivr";
import Mail from "../pages/app/CommunicationSuite/mail";
import Whatsapp from "../pages/app/CommunicationSuite/whatsapp";
import Companies from "../pages/app/companies/CompaniesList";
import Tasks from "../pages/app/tasks/tasksList";
import Activities from "../pages/app/activities/ActivitiesList";

export default function AppRouter() {
  // Define contacts state here to pass to ContactsCreate
  const [contacts, setContacts] = useState([]);

  const addContact = (contact) => {
    setContacts((prev) => [...prev, contact]);
  };

  return (
    <Routes>
      {/* LOGIN */}
      <Route path="/" element={<Login />} />

      {/* FORGOT PASSWORD */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ========== Tenant Admin Layout Routes ========== */}
      <Route element={<TenantAdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route
          path="/contactsCreate"
          element={<ContactsCreate addContact={addContact} />}
        />
        <Route path="/contactsEdit/:id" element={<ContactsEdit />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/products" element={<Products />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/tenantUserCreate" element={<TenantUserCreate />} />
        <Route path="/tenantUserEdit" element={<TenantUserEdit />} />
        <Route path="/tenantUserList" element={<TenantUserList />} />
        <Route path="/planDetails" element={<PlanDetails />} />
        <Route path="/upgradePlan" element={<UpgradePlan />} />
        <Route path="/tenantSettings" element={<TenantSettings />} />
        <Route path="/ivr" element={<Ivr />} />
        <Route path="/mail" element={<Mail />} />
        <Route path="/whatsapp" element={<Whatsapp />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/activities" element={<Activities />} />
      </Route>
    </Routes>
  );
}
