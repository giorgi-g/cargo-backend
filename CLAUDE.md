# Cargo Platform Monorepo

This monorepo contains the **backend** and **frontend** for a modern **B2B SaaS logistics management platform** designed for business-to-business cargo organization, visibility, and control.

---

## Overview

**Cargo Platform** empowers companies to manage, track, and transfer goods across organizations, supporting the journey from production to delivery—including robust business rules, strong access controls, and flexible business models.

---

## Key Features & Concepts

- Unified management of **storage, transfer, and tracking** of goods.
- Multi-company architecture with **role-based and company-level permissions**.
- **Public goods catalog** for selected manufacturers and suppliers, with granular visibility controls.

---

## Core Company Types

1. **Manufacturer** – Produces goods for clients.
2. **Supplier** – Intermediary connecting manufacturers and logistics companies.
3. **Logistics** – Handles delivery of goods, whether directly from suppliers or from manufacturers.
4. **Customer** – Receives goods, transacted via logistics services or partners.

### Business Workflows

- Manufacturers create goods for Customers.
- Suppliers facilitate and mediate logistics.
- Logistics partners handle delivery between any parties.
- Customers receive goods through the coordinated workflow.

> **Note:** Role-based access and company-specific data segregation is strictly enforced.

---

## User Roles Hierarchy

The system supports defined roles, reflecting real-world separation of concerns. Suggestions for improvement in role-mapping, permission granularity, and onboarding flow are welcome.

| Role                | Description & Permissions                                                                                           |
|---------------------|---------------------------------------------------------------------------------------------------------------------|
| ROOT                | One per platform; absolute access to all data and actions.                                                          |
| ADMIN               | One per company; unrestricted access within their company.                                                          |
| DIRECTOR            | As ADMIN, cannot alter ADMIN permissions.                                                                           |
| GENERAL_MANAGER     | Same as DIRECTOR.                                                                                                   |
| SALES_MANAGER       | Can view reports/history, confirm buying/selling of orders.                                                         |
| HR_MANAGER          | Can onboard staff                                                                                                   |
| DRIVER              | Can self-register or be added to a company; manages own jobs and availability.                                      |
|                     | If is assigned to a company than the driver sees only orders for that company.                                      |
|                     | Otherwise driver sees all public orders.                                                                            |
| LOGISTIC_MANAGER    | Can request goods/orders; requires confirmation from SALES_MANAGER and GENERAL_MANAGER.                             |
| WAREHOUSE_MANAGER   | Can request goods/orders; forwarded to SUPPLY_MANAGER for confirmation.                                             |
|                     | Can browse services and request transfers (from manufacturer/supplier).                                             |
| SUPPLY_MANAGER      | Similar to WAREHOUSE_MANAGER; requests go to GENERAL_MANAGER for confirmation.                                      |
| DELIVERY_MANAGER    | Controls efficient process of delivery from manufacturer or supplier to customer. LOGISTIC_MANAGER permissions      |
| CUSTOMER_MANAGER    | Read-only access to all company data.                                                                               |
| ACCOUNTANT          | Read-only access to all company data.                                                                               |
| CUSTOMER            | Can browse services and request transfers (from manufacturer/supplier).                                             |
| GUEST               | Same as CUSTOMER, but data is ephemeral and auto-deleted in 3 days.                                                 |

> **Improvements Sought:** Please suggest any missing real-world logistics roles or suggest refinements to this mapping!

---

## Data Relationships & Definitions

- **Content Types**: The system supports entity types such as `HOME`, `NEWS`, `TEXT`, `GALLERY`, `CONTACTS`, `TEAM`, `VACANCY`, `TRANSFER`, `PACKAGE`, `COMPANY`, `FAQ`, `ABOUT_US`, `SLIDER`, `BANNER`, `SERVICE`, `BRAND`, `HEADER`, `FOOTER`, `DESTINATION`, `GOODS`.
- **Simple Pages**: Content types such as `HOME`, `NEWS`, `TEAM`, etc., are simple text or informational pages.
- **GOODS**: Stores structured information for materials (area, weight, volume, etc.), inventory, and pricing. Only users with at least WAREHOUSE_MANAGER or SUPPLY_MANAGER privileges can add/update materials; deleted records are soft-deleted.
- **Shipment**: We have one to many relationship between Shipment and Goods. Each Shipment explicitly references customer, supplier, and logistics participants. E.g we can request multiple Goods from Supplier Company, add these Goods to one Shipment. Then we can add Logistic Company that will arrange transfer from Supplier Company to Customer company through a Logistic Company and using one specific Driver.
- **Chain**: Customers can also request receiving Goods from multiple Suppliers which means that customers must create multiple Orders and combine them into one OrderChain. The table will have Many to Many relationship with Order

---


 
