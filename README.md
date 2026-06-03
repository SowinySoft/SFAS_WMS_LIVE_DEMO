# SFAS WMS — Enterprise Resource Planning Suite

[![Live Demo](https://img.shields.io/badge/Live%20Demo-try%20it%20now-brightgreen)](https://tops-professor-bass-accompanied.trycloudflare.com)
[![Tests](https://img.shields.io/badge/Tests-400%2F400%20%26%2028%2F28%20E2E-success)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)
[![Stack](https://img.shields.io/badge/Stack-React%2018%20%7C%20Node.js%2020%20%7C%20PostgreSQL%2018-blue)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)
[![License](https://img.shields.io/badge/License-Proprietary-red)](https://github.com/SowinySoft/SFAS_WMS_LIVE_DEMO)

**SFAS WMS** is a full-stack Enterprise Resource Planning system covering financial accounting (GL, AP, AR), warehouse management, procurement, sales, payroll, and fixed assets — all backed by an immutable SHA-256 audit chain. 120 tables across 14 schemas, 15 currencies, 8 locales, 400+ automated tests.

---

## Demo

### Live Instance

> **[Launch Live Demo →](https://tops-professor-bass-accompanied.trycloudflare.com)**
>
> **Credentials:** `admin` / `Adm!n@2026`

Seeded with 26 chart-of-accounts, 19 journal entries, 4 customers, 4 vendors, 4 purchase orders, and 4 inventory items.

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

### Warehouse & Inventory

| Feature | Advantage |
|---------|-----------|
| **Inventory Management** | Real-time stock tracking, bin locations, stock adjustments |
| **RFID Integration** | Tag/reader/event management, proximity detection, real-time polling |
| **Purchase Orders** | End-to-end procurement automation, receiving, GRN |
| **Stock Transfers** | Approval workflows (PENDING_APPROVAL → APPROVED), inter-warehouse moves |
| **Barcode/QR Scanner** | 6 scan types (ITEM, BIN, RECEIVE, PICK, SHIPMENT, TRANSFER), device camera integration |

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
| **Cross-Tab Pivot Reports** | Revenue vs Expenses, Sales vs Purchases, Warehouse Indoor vs Outdoor |
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

---

## Architecture

```
┌──────────┐     ┌──────────┐     ┌────────────┐
│  React   │────▶│  Node.js │────▶│PostgreSQL 18│
│  + Vite  │     │  Express │     │14 schemas   │
│  port 3000│     │  port 4000│     │120 tables   │
└──────────┘     └──────────┘     └────────────┘
                       │
                  ┌────┴────┐
                  │  Redis  │ (graceful fallback)
                  └─────────┘
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
- **E2E:** 28/28 Playwright tests passing (Chromium)
- **Load:** 864 req/s throughput, 0 failures at 100 concurrent users

---

## Screenshots

| Dashboard | Chart of Accounts |
|-----------|------------------|
| ![Dashboard](screenshots/dashboard.png) | ![Chart of Accounts](screenshots/chart-of-accounts.png) |

| Journal Entries | Inventory Management |
|-----------------|---------------------|
| ![Journals](screenshots/journals.png) | ![Inventory](screenshots/inventory.png) |

| Audit Trail |
|-------------|
| ![Audit Trail](screenshots/audit-log.png) |

---

## License

**Proprietary** — All Rights Reserved. This is a private, owned product.

---

*Built with React, Node.js, and PostgreSQL.*
