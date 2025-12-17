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

| Role                | Description & Permissions                                                                                                                  |
|---------------------|--------------------------------------------------------------------------------------------------------------------------------------------|
| ROOT                | One per platform; absolute access to all data and actions.                                                                                 |
| ADMIN               | One per company; unrestricted access within their company.                                                                                 |
| DIRECTOR            | As ADMIN, cannot alter ADMIN permissions.                                                                                                  |
| GENERAL_MANAGER     | Same as DIRECTOR.                                                                                                                          |
| SALES_MANAGER       | Can view reports/history, confirm buying/selling of orders.                                                                                |
| HR_MANAGER          | Can onboard staff                                                                                                                          |
| DRIVER              | Can self-register or be added to a company; manages own jobs and availability.                                                             |
|                     | If is assigned to a company than the driver sees only orders for that company.                                                             |
|                     | Otherwise driver sees all public orders.                                                                                                   |
| LOGISTIC_MANAGER    | Is a dispatcher who can request goods/orders; requires confirmation from SALES_MANAGER and GENERAL_MANAGER. has FLEET_MANAGER role as well |
| WAREHOUSE_MANAGER   | Can request goods/orders; forwarded to SUPPLY_MANAGER for confirmation.                                                                    |
|                     | Can browse services and request transfers (from manufacturer/supplier).                                                                    |
| SUPPLY_MANAGER      | Similar to WAREHOUSE_MANAGER; requests go to GENERAL_MANAGER for confirmation.                                                             |
| DELIVERY_MANAGER    | Controls efficient process of delivery from manufacturer or supplier to customer. LOGISTIC_MANAGER permissions                             |
| CUSTOMER_MANAGER    | Read-only access to all company data.                                                                                                      |
| ACCOUNTANT          | Read-only access to all company data.                                                                                                      |
| CUSTOMER            | Can browse services and request transfers (from manufacturer/supplier).                                                                    |
| GUEST               | Same as CUSTOMER, but data is ephemeral and auto-deleted in 3 days.                                                                        |

> **Improvements Sought:** Please suggest any missing real-world logistics roles or suggest refinements to this mapping!

---

## Data Relationships & Definitions

- **Content Types**: The system supports entity types such as `HOME`, `NEWS`, `TEXT`, `GALLERY`, `CONTACTS`, `TEAM`, `VACANCY`, `TRANSFER`, `PACKAGE`, `COMPANY`, `FAQ`, `ABOUT_US`, `SLIDER`, `BANNER`, `SERVICE`, `BRAND`, `HEADER`, `FOOTER`, `DESTINATION`, `GOODS`.
- **Simple Pages**: Content types such as `HOME`, `NEWS`, `TEAM`, etc., are simple text or informational pages.
- **GOODS**: Stores structured information for materials (area, weight, volume, etc.), inventory, and pricing. Only users with at least WAREHOUSE_MANAGER or SUPPLY_MANAGER privileges can add/update materials; deleted records are soft-deleted.
- **Shipment**: We have a one-to-many relationship between Shipment and Goods. Each Shipment explicitly references customer, supplier, and logistics participants.
  - E.g. we can request multiple Goods from a Supplier Company, add these Goods to one Shipment.
  - Then we can add Logistic Company that will arrange transfer from Supplier Company to Customer company through a Logistic Company and using one specific Driver.
- **OrderShipment**: Customers can also request to receive Goods from multiple Suppliers which means that customers
  must create multiple Shipments under one Order.

---

## Schema Notes for AI Assistance

### Key Model Relationships
- `Company` -> `User` -> `Shipment` -> `ShipmentGoods` -> `Content` (contentType=GOODS)
- `Order` -> `OrderShipment` -> `Shipment` (many-to-many junction)
- `Content` is polymorphic: check `contentType` field (GOODS, DESTINATION, etc.)
- `Shipment` has 3 company references: `customerId`, `supplierId`, `logisticsId`

### Enums In Use
- `ShipmentType` (FTL/LTL/FCL/LCL) - on `Shipment.shipmentType`
- `ServiceType` (IMPORT/EXPORT/DOMESTIC) - on `Shipment.serviceType`
- `CargoType` - on `Content.cargoType` (for GOODS)
- `HazardClass` - on `Content.hazardClass` (for dangerous goods)
- `VehicleType` - on `Transport.vehicleType`
- `TransportMode` (AIR/SEA/RAIL/ROAD) - on `Transport.type`

### Unused Enums (Available for Future Use)
- `Incoterm` (EXW, FOB, CIF, DDP, etc.) - consider adding to `Shipment` for international trade
- `TransferType` (PRIVATE/SHARED/LUXURY) - not referenced
- `BookingStatus` - not referenced (different from `ShipmentStatus`)

### Known Schema Gaps
- **Invoice model**: Not present - needed for B2B billing
- **Notification model**: Not present - needed for alerts/status changes
- Soft delete (`deletedAt`): Only on `Content` model

### Inconsistencies
- `Company.createdBy/updatedBy` are optional (`String?`), all other models require them
- `User` unique: `@@unique([email, status])` - same email can exist with different statuses

### Missing Indexes (Add When Needed)
- `License`: `@@index([userId])`
- `Transport`: `@@index([userId])`

### ID Formats (Auto-generated)
- Company: `COMPANY-{uuid}`
- User: `USER-{uuid}`
- Shipment: `SHIPMENT-{uuid}`
- Order: `ORDER-{uuid}`
- Content: `CONTENT-{uuid}`
- File: `FILE-{uuid}`

### Security Notes
- `User.password`: Ensure bcrypt/argon2 hashing in service layer
- PII fields: `User.personalId`, `User.passportNumber` - consider encryption

---

## Service Architecture

### Core Services

| Service | Models | Description |
|---------|--------|-------------|
| `AuthService` | User | Login, registration, password reset, JWT tokens |
| `UserService` | User, License | CRUD, profile, passport images, role assignment |
| `CompanyService` | Company | CRUD, parent-child hierarchy, company type management |
| `ShipmentService` | Shipment, ShipmentGoods | Create shipments, assign goods, track status lifecycle |
| `OrderService` | Order, OrderShipment | Create orders, link multiple shipments, payment tracking |
| `ContentService` | Content, PageContents, ContentFiles | Polymorphic CRUD - handles GOODS, DESTINATION, pages |
| `TransportService` | Transport, TransportFiles | Vehicle fleet management, driver assignment |
| `FileService` | File, Folder | Upload, storage (S3/local), folder hierarchy |
| `SubscriptionService` | MembershipPlan, CompanySubscription | Plans, billing cycles, subscription lifecycle |

### Support Services

| Service | Models | Description |
|---------|--------|-------------|
| `PageService` | Page, PageContents | CMS pages, nested tree structure (lft/rgt) |
| `CurrencyService` | Currency | Exchange rates, default currency |
| `LanguageService` | Language | i18n support, active languages |
| `CountryService` | Country | Country data, phone codes, currencies |
| `LicenseService` | License | Driver license management, expiry tracking |

### Service Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway                             │
├──────────┬──────────┬──────────┬──────────┬────────────────┤
│   Auth   │   User   │ Company  │  Content │     File       │
├──────────┴──────────┴──────────┴──────────┴────────────────┤
│                    Shipment Service                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │   Orders    │──│  Shipments  │──│   ShipmentGoods     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│   Transport   │  Subscription  │  Currency  │   Country    │
└───────────────┴────────────────┴────────────┴──────────────┘
```

### Key Service Operations

**ShipmentService**
- `createShipment(userId, companyId, data)` - Draft shipment
- `addGoods(shipmentId, contentIds[])` - Link goods via ShipmentGoods
- `assignDriver(shipmentId, driverId)` - Assign driver
- `updateStatus(shipmentId, status)` - Status transitions (DRAFT -> BOOKED -> IN_TRANSIT -> DELIVERED)
- `assignParticipants(shipmentId, {customerId, supplierId, logisticsId})` - Set company roles

**OrderService**
- `createOrder(userId, companyId, data)` - New order
- `addShipments(orderId, shipmentIds[])` - Link via OrderShipment
- `calculateTotals(orderId)` - Sum subtotal, tax, discount, total
- `processPayment(orderId, method, ref)` - Update payment status

**ContentService** (Polymorphic)
- `createGoods(companyId, data)` - contentType=GOODS, with cargoType, hazardClass
- `createDestination(companyId, data)` - contentType=DESTINATION, with lat/lng
- `updateInventory(contentId, quantity)` - For GOODS: availableQuantity
- `softDelete(contentId)` - Sets deletedAt

### Multi-Tenancy Pattern
All queries MUST filter by `companyId` except for ROOT role:
```typescript
// Every service method should include company scoping
findAll(companyId: string) {
  return this.prisma.shipment.findMany({
    where: { companyId }
  });
}
```

### Audit Trail Pattern
All create/update operations must set audit fields:
```typescript
create(data, userId: string) {
  return this.prisma.model.create({
    data: {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    }
  });
}
```
