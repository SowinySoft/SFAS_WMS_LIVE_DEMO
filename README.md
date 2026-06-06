# SFAS WMS — Enterprise Resource Planning Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-try%20it%20now-brightgreen)](https://tops-professor-bass-accompanied.trycloudflare.com)
[![Tests](https://img.shields.io/badge/Tests-400%2F400%20%26%2057%2F57%20E2E-success)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Node.js%2020%20%7C%20PostgreSQL%2018-blue)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)
[![License](https://img.shields.io/badge/License-Proprietary-red)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)

**SFAS WMS** is a full-stack Enterprise Resource Planning system covering financial accounting (GL, AP, AR), warehouse management, procurement, sales, payroll, and fixed assets — all backed by an immutable SHA-256 audit chain. 147+ tables across 17+ schemas, 15 currencies, 8 locales, 400+ automated tests.

---

## Demo

### Live Instance

> **[Launch Live Demo →](https://tops-professor-bass-accompanied.trycloudflare.com)**
>
> **Credentials:** `admin` / `Adm!n@2026`

Seeded with 26 chart-of-accounts, 19 journal entries, 7 customers, 6 vendors, 4 purchase orders, 3 sales orders, 4 employees, 4 projects, and 5 inventory items.

### Video Walkthrough (60s)

[▶️ Download / View Demo Video](sfas-suite-demo.mp4) (2.1 MB, MP4)

---

## Key Features & Advantages

### Financial Management

| Feature | Advantage |
|---------|-----------|
| **Chart of Accounts** | Hierarchical tree view with inline editing, 70-account standard COA template import |
| **General Ledger** | Journal entry posting, approval workflow, period management, multi-currency (15 currencies) |
| **Accounts Payable** | Vendor management, PO-based invoicing, 3-way match, payment tracking |
| **Accounts Receivable** | Customer management, sales invoices, aging reports, receipt tracking |
| **Payroll** | Employee management, timesheets, pay runs, deductions |
| **Fixed Assets** | Asset register, depreciation schedules, disposal tracking |
| **FX Reconciliation** | Monthly automated rate anomaly detection, coefficient-of-variation analysis |
| **Budgeting & Forecasting** | Budget vs actual, rolling forecasts, cash flow forecasting |

### Warehouse & Inventory

| Feature | Advantage |
|---------|-----------|
| **Inventory Management** | Real-time stock tracking, bin locations, stock adjustments, ABC analysis |
| **RFID Integration** | Tag/reader/event management, proximity detection, real-time polling |
| **Purchase Orders** | End-to-end procurement automation, receiving, GRN |
| **Stock Transfers** | Approval workflows (PENDING_APPROVAL → APPROVED), inter-warehouse moves |
| **Barcode/QR Scanner** | 6 scan types (ITEM, BIN, RECEIVE, PICK, SHIPMENT, TRANSFER), device camera integration |
| **Lot/Serial Traceability** | End-to-end lot tracking, serial number assignment, trace movements up/down stream |

### Audit & Compliance

| Feature | Advantage |
|---------|-----------|
| **Immutable Audit Trail** | SHA-256 hash chain with integrity verification, 46+ entity types tracked |
| **Request ID Tracing** | End-to-end `X-Request-ID` propagation from browser to PostgreSQL session |
| **Role-Based Access** | Three-tier RBAC (SYS_ADMIN → COMPANY_ADMIN → BRANCH_MANAGER), scope-enforced middleware |
| **Rate Limiting** | Role-based tiers: SYS_ADMIN=2000, FIN_MGR=1000, ACCOUNTANT=500, anonymous=200 req/15min |

### Analytics & Intelligence

| Feature | Advantage |
|---------|-----------|
| **Executive Dashboard** | Real-time KPIs: cash flow, aging reports, inventory turns, revenue trends |
| **27 Report Tabs** | Cross-tab pivot reports, executive KPI dashboard, cash flow, mfg OEE, sales funnel, HR cost, EDI scorecard |
| **AI Forecasting** | Mock Prophet/ARIMA engine, confidence intervals, actual-amount tracking |
| **Query Optimization** | Slow query ring buffer + one-click EXPLAIN ANALYZE |
| **Synthetic Monitoring** | Automated probes (login → PO → GRN), pass/fail history, per-step timing |

### Platform Features

| Feature | Advantage |
|---------|-----------|
| **Internationalization** | 8 locales (en-US, ar-SA, fr-FR, de-DE, es-ES, zh-CN, tr-TR, en-GB), Arabic RTL support |
| **Multi-Currency** | 15 currencies with locale-aware formatting |
| **Responsive UI** | Collapsible sidebar, touch-friendly (44px targets), keyboard-first design, reduced-motion |
| **Backup & Restore** | Self-service backup creation, cloud storage (S3/GCS), restoration with progress tracking |
| **Helm + K8s** | Full Helm chart, Kubernetes manifests with HPA autoscaling, TLS via cert-manager |
| **Docker Compose** | Production-grade docker-compose with PostgreSQL + Redis, all migrations pre-loaded |

### Extended Modules

| Module | Highlights |
|--------|------------|
| **Manufacturing / BOM** | Production orders, work centers, BOMs, MRP, production dashboard |
| **CRM / Sales Pipeline** | Leads, opportunities (Kanban), quotations with line items, sales KPIs |
| **HR Self-Service Portal** | Payslips, leave requests, expense claims, manager approvals |
| **Project Accounting** | Project P&L, task Kanban, time tracking, approvals |
| **EDI / PEPPOL Invoicing** | AS2/AS4 transport, XAdES-BES signing, SMP discovery, buy-side matching |
| **Document Management** | Version-controlled documents, workflow review/approve, categories |
| **E-commerce Storefront** | Public catalog, cart, checkout (coupons/shipping/tax), order history |
| **Supplier Portal** | Vendor PO confirmations, invoice submission, catalog management |
| **API Developer Portal** | Swagger UI, API key management, version negotation |

---

## Architecture

```
┌──────────┐     ┌──────────┐     ┌──────────────┐
│  React   │────▶│  Node.js │────▶│ PostgreSQL 18 │
│  + Vite  │     │  Express │     │ 17+ schemas   │
│  port 3000│     │  port 4000│     │ 147+ tables   │
└──────────┘     └──────────┘     └──────────────┘
       │               │
       │          ┌────┴────┐
       │          │  Redis  │ (graceful fallback)
       │          └─────────┘
       │          ┌─────────────────────┐
       └─────────▶│ Socket.IO (real-time)│
                  └─────────────────────┘
```

### Frontend
- React 18 + Vite 5, esbuild minifier, vendor code splitting
- TanStack Query (server state) + Zustand (client state)
- Recharts + D3 for analytics
- 8 locale files, React Context i18n (zero external deps)
- ARIA roles, focus traps, keyboard navigation, screen reader support

### Backend
- Node.js 20 + Express 4.18, JWT + API Key auth
- PostgreSQL 18 with pg-pool (schema-based multi-tenant)
- Immutable audit service (SHA-256 hash chain, 46+ entity types)
- Socket.IO real-time events, Pino structured logging
- Role-based rate limiting, MFA for privileged roles

### Testing
- **Server:** 400/400 Jest tests passing (10 suites)
- **E2E:** 57/57 Playwright tests passing (Chromium)
- **Load:** 864 req/s throughput, 0 failures at 100 concurrent users

---

## Screenshots

### Overview & Dashboard

| Dashboard |
|-----------|
| ![Dashboard](screenshots/00-dashboard.png) |

### Financial Management

| Chart of Accounts | Journals | Trial Balance |
|-------------------|----------|---------------|
| ![Chart of Accounts](screenshots/01-chart-of-accounts.png) | ![Journals](screenshots/02-journals.png) | ![Trial Balance](screenshots/04-trial-balance.png) |

| P&L | Balance Sheet | FX Engine |
|-----|---------------|-----------|
| ![P&L](screenshots/05-pnl.png) | ![Balance Sheet](screenshots/06-balance-sheet.png) | ![FX Engine](screenshots/07-fx-engine.png) |

| Budget | Cash Forecast | Audit Log |
|--------|---------------|-----------|
| ![Budget](screenshots/35-budget.png) | ![Cash Forecast](screenshots/36-cash-forecast.png) | ![Audit Log](screenshots/39-audit-log.png) |

| Tax Management | Approvals | Intercompany |
|----------------|-----------|--------------|
| ![Tax](screenshots/40-tax.png) | ![Approvals](screenshots/41-approvals.png) | ![Intercompany](screenshots/43-intercompany.png) |

### Sales & Receivables

| Customers | Sales Orders | Sales Invoices |
|-----------|--------------|----------------|
| ![Customers](screenshots/08-customers.png) | ![Sales Orders](screenshots/09-sales-orders.png) | ![Sales Invoices](screenshots/10-sales-invoices.png) |

| AR Aging | CRM Dashboard | CRM Leads |
|----------|---------------|-----------|
| ![AR Aging](screenshots/11-ar-aging.png) | ![CRM Dashboard](screenshots/57-crm-dashboard.png) | ![CRM Leads](screenshots/58-crm-leads.png) |

| CRM Opportunities (Kanban) | CRM Quotes |
|----------------------------|------------|
| ![CRM Opportunities](screenshots/59-crm-opportunities.png) | ![CRM Quotes](screenshots/60-crm-quotes.png) |

### Procurement & Payables

| Purchase Orders | Goods Receipts | Vendor Invoices |
|----------------|----------------|-----------------|
| ![Purchase Orders](screenshots/12-purchase-orders.png) | ![Goods Receipts](screenshots/13-goods-receipts.png) | ![Vendor Invoices](screenshots/14-vendor-invoices.png) |

| Vendors | AP Aging | 3-Way Match |
|---------|----------|-------------|
| ![Vendors](screenshots/15-vendors.png) | ![AP Aging](screenshots/16-ap-aging.png) | ![3-Way Match](screenshots/17-three-way-match.png) |

### Warehouse & Inventory

| Inventory | Inventory Master Data | Stock Transfers |
|-----------|----------------------|-----------------|
| ![Inventory](screenshots/18-inventory.png) | ![Master Data](screenshots/19-inventory-master-data.png) | ![Stock Transfers](screenshots/20-stock-transfers.png) |

| Shipments | WMS Dashboard | WMS Bins |
|-----------|---------------|----------|
| ![Shipments](screenshots/21-shipments.png) | ![WMS Dashboard](screenshots/22-wms-dashboard.png) | ![WMS Bins](screenshots/23-wms-bins.png) |

| WMS GL Integration | Barcode Scanner | FIFO/FEFO Picking |
|--------------------|-----------------|--------------------|
| ![WMS GL Integration](screenshots/24-wms-gl-integration.png) | ![Scanner](screenshots/25-phase2-scanner.png) | ![FIFO/FEFO](screenshots/26-phase2-fifo-fefo.png) |

| Replenishment | Cross-Docking | Lot/Serial Traceability |
|---------------|---------------|-------------------------|
| ![Replenishment](screenshots/27-phase2-replenishment.png) | ![Cross-Dock](screenshots/28-phase2-cross-dock.png) | ![Traceability](screenshots/67-traceability.png) |

### Manufacturing

| Manufacturing Dashboard | BOMs | Production Orders |
|------------------------|------|-------------------|
| ![Mfg Dashboard](screenshots/52-mfg-dashboard.png) | ![BOMs](screenshots/53-mfg-boms.png) | ![Production Orders](screenshots/54-mfg-production-orders.png) |

| Work Centers | Production Lines |
|--------------|------------------|
| ![Work Centers](screenshots/55-mfg-work-centers.png) | ![Production Lines](screenshots/56-mfg-production-lines.png) |

### Payments & Banking

| Payments | Banking | Fixed Assets |
|----------|---------|--------------|
| ![Payments](screenshots/31-payments.png) | ![Banking](screenshots/30-banking.png) | ![Fixed Assets](screenshots/29-fixed-assets.png) |

### Payroll & HR

| Payroll | Expense Claims | Time Attendance |
|---------|---------------|-----------------|
| ![Payroll](screenshots/32-payroll.png) | ![Expense Claims](screenshots/33-expense-claims.png) | ![Time Attendance](screenshots/34-time-attendance.png) |

| HR Portal Dashboard | HR Payslips | HR Leave |
|---------------------|-------------|----------|
| ![HR Dashboard](screenshots/61-hr-portal--dashboard.png) | ![HR Payslips](screenshots/61-hr-portal--payslips.png) | ![HR Leave](screenshots/61-hr-portal--leave.png) |

### Project Accounting

| Projects | Tasks (Kanban) | Time Tracking |
|----------|----------------|---------------|
| ![Projects](screenshots/62-projects--projects.png) | ![Tasks](screenshots/62-projects--tasks.png) | ![Project P&L](screenshots/62-projects--project-p-l.png) |

### EDI / Electronic Invoicing

| EDI Dashboard | EDI Partners | EDI Outbound |
|---------------|--------------|--------------|
| ![EDI](screenshots/63-edi.png) | ![EDI Partners](screenshots/63-edi--partners.png) | ![EDI Outbound](screenshots/63-edi--outbound.png) |

### Reports (27 Tabs)

| Executive KPI | Sales by Item | Inventory Valuation |
|---------------|---------------|---------------------|
| ![Executive KPI](screenshots/42-reports--executive-kpi.png) | ![Sales by Item](screenshots/42-reports--sales-by-item.png) | ![Inventory Valuation](screenshots/42-reports--inventory-valuation.png) |

| Production Summary | MRP Report | Cash Flow |
|-------------------|------------|-----------|
| ![Production Summary](screenshots/42-reports--production-summary.png) | ![MRP Report](screenshots/42-reports--mrp-report.png) | ![Cash Flow](screenshots/42-reports--cash-flow.png) |

| Sales Funnel | Mfg OEE | Budget vs Actual |
|--------------|---------|------------------|
| ![Sales Funnel](screenshots/42-reports--sales-funnel.png) | ![Mfg OEE](screenshots/42-reports--mfg-oee.png) | ![Budget vs Actual](screenshots/42-reports--budget-vs-actual.png) |

### Portals

| E-commerce Storefront | Supplier Portal | HR Self-Service |
|----------------------|-----------------|-----------------|
| ![Storefront](screenshots/64-storefront.png) | ![Supplier Portal](screenshots/63-edi.png) | ![HR Portal](screenshots/61-hr-portal.png) |

### Platform & Admin

| Admin System Health | Admin Backup | Admin Data Management |
|---------------------|--------------|----------------------|
| ![System Health](screenshots/70-admin--system-health.png) | ![Backup](screenshots/70-admin--backup.png) | ![Data Management](screenshots/70-admin--data-management.png) |

| Users | Permissions | Company Setup |
|-------|-------------|---------------|
| ![Users](screenshots/74-users.png) | ![Permissions](screenshots/48-permissions.png) | ![Company](screenshots/72-company.png) |

### Developer & Collaboration

| API Developer Portal | API Docs (Swagger) | Real-time Collaboration |
|---------------------|-------------------|------------------------|
| ![Developer Portal](screenshots/66-developer.png) | ![API Docs](screenshots/66-developer--api-docs.png) | ![Collaboration](screenshots/65-collaboration.png) |

### Schema & Documentation

| Schema Portal v2.0 | Documents |
|--------------------|-----------|
| ![Schema Portal](screenshots/69-schema.png) | ![Documents](screenshots/68-documents.png) |

### Advanced Features

| AI Monitor | AI Forecast | BI Dashboard Builder |
|------------|-------------|---------------------|
| ![AI Monitor](screenshots/37-ai-monitor.png) | ![AI Forecast](screenshots/38-ai-forecast.png) | ![BI Dashboard](screenshots/47-bi-dashboard.png) |

| RFID Tags | RFID Readers | RFID History |
|-----------|--------------|--------------|
| ![RFID Tags](screenshots/77-rfid--tags.png) | ![RFID Readers](screenshots/77-rfid--readers.png) | ![RFID History](screenshots/77-rfid--reading-history.png) |

| Cost Allocation | Recurring Entries | Workflows |
|----------------|-------------------|-----------|
| ![Cost Allocation](screenshots/46-phase1-cost-allocation.png) | ![Recurring](screenshots/44-phase1-recurring.png) | ![Workflows](screenshots/50-workflows.png) |

### Demo & About

| Demo Simulation | Demo WebUI | About / Keyboard Shortcuts |
|----------------|------------|---------------------------|
| ![Demo Simulation](screenshots/75-demo-simulation.png) | ![Demo WebUI](screenshots/76-demo-webui.png) | ![About](screenshots/78-about.png) |

| Schema Portal (expanded) |
|--------------------------|
| [![Schema Portal](screenshots/69-schema.png)](SFAS_schema.html) |

---

## Schema Portal v2.0

Explore the full database schema documentation with the interactive **[Schema Portal](SFAS_schema.html)** — a standalone HTML document covering:

- **Section 01-04**: 147+ tables across 17+ schemas (sfas_core, sfas_financial, sfas_inventory, sfas_sales, sfas_purchasing, sfas_payroll, sfas_manufacturing, sfas_traceability, sfas_edi, sfas_documents, sfas_projects, sfas_crm, sfas_storefront, sfas_supplier, sfas_collaboration, sfas_wms, sfas_phase1)
- **Section 05**: 12 portal domains with module cards (Manufacturing, CRM, EDI, HR, Projects, E-commerce, Supplier, Document, Collaboration, Traceability, Developer, Stock Pillars)
- **Section 06**: Schema diagram, entity counts per module / per schema
- **Section 07**: 5 API key highlights (audit chain, RBAC, rate limiting, real-time, i18n)
- **Section 08**: Portal ecosystem architecture — 12 portal cards with routes, badges, integration pills

---

## License

**Proprietary** — All Rights Reserved. This is a private, owned product.

---

*Built with React, Node.js, and PostgreSQL.*
