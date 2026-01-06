CRM SaaS Platform – Project Description

A multi-tenant CRM SaaS platform designed to support scalable customer, sales, activity, and inventory management for multiple organizations within a single system. The platform follows a single PostgreSQL database with schema-per-tenant isolation, ensuring strong data separation, security, and scalability across tenants.

The system is built using a generic, extensible REST API architecture, where core CRUD operations, related-record tabs (notes, activities, attachments, etc.), and module-specific business logic are implemented in a reusable and consistent manner across all modules. This design enables rapid onboarding of new CRM modules as well as support for custom tenant-defined modules without duplicating backend logic.

A dedicated Tenant Schema Manager handles tenant onboarding by dynamically creating schemas, tables, indexes, and foreign key relationships, allowing new tenants to be provisioned automatically and safely. The platform includes a custom role-based access control (RBAC) system with tenant-level roles and fine-grained permissions, secured using JWT-based authentication.

The application follows a monolithic service architecture optimized for SaaS workflows, with a modern frontend built using React (Vite), Zustand for state management, and Tailwind CSS with shadcn/ui for a scalable UI system. A Super Admin control panel enables centralized tenant management, configuration, and system-level operations.

The project is actively under development, with V1 production release in progress, and is being built using Azure Repos and Azure Boards to support Agile development, version control, and task tracking.
