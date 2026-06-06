const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3000';
const OUT_DIR = path.join(__dirname, '..', 'screenshots');
const DELAY = 2000;

const ROUTES = [
  // ── Overview ──
  { path: '/dashboard', name: '00-dashboard' },

  // ── Ledger ──
  { path: '/chart-of-accounts', name: '01-chart-of-accounts' },
  { path: '/journals', name: '02-journals' },
  { path: '/create-journal', name: '03-create-journal' },
  { path: '/trial-balance', name: '04-trial-balance' },
  { path: '/pnl', name: '05-pnl' },
  { path: '/balance-sheet', name: '06-balance-sheet' },
  { path: '/phase1/fx', name: '07-fx-engine' },

  // ── Sales ──
  { path: '/customers', name: '08-customers' },
  { path: '/sales-orders', name: '09-sales-orders' },
  { path: '/sales-invoices', name: '10-sales-invoices' },
  { path: '/ar-aging', name: '11-ar-aging' },

  // ── Procurement ──
  { path: '/purchase-orders', name: '12-purchase-orders' },
  { path: '/goods-receipts', name: '13-goods-receipts' },
  { path: '/vendor-invoices', name: '14-vendor-invoices' },
  { path: '/vendors', name: '15-vendors' },
  { path: '/ap-aging', name: '16-ap-aging' },
  { path: '/three-way-match', name: '17-three-way-match' },

  // ── Inventory & WMS ──
  { path: '/inventory', name: '18-inventory' },
  { path: '/inventory/master-data', name: '19-inventory-master-data',
    tabs: ['Categories', 'Units of Measure', 'Tags'] },
  { path: '/stock-transfers', name: '20-stock-transfers',
    tabs: ['Transfers', 'Adjustments'] },
  { path: '/shipments', name: '21-shipments',
    tabs: ['Inbound', 'Outbound'] },
  { path: '/wms/dashboard', name: '22-wms-dashboard' },
  { path: '/wms/bins', name: '23-wms-bins' },
  { path: '/wms/gl-integration', name: '24-wms-gl-integration',
    tabs: ['Dashboard', 'Accounting Events', 'GL Defaults'] },

  // ── Phase 2 (WMS enhancements) ──
  { path: '/phase2/scanner', name: '25-phase2-scanner' },
  { path: '/phase2/fifo-fefo', name: '26-phase2-fifo-fefo' },
  { path: '/phase2/replenishment', name: '27-phase2-replenishment',
    tabs: ['Triggers', 'Rules'] },
  { path: '/phase2/cross-dock', name: '28-phase2-cross-dock' },

  // ── Assets & Banking ──
  { path: '/assets', name: '29-fixed-assets' },
  { path: '/banking', name: '30-banking',
    tabs: ['Accounts', 'Transactions'] },
  { path: '/payments', name: '31-payments' },

  // ── Payroll & HR ──
  { path: '/payroll', name: '32-payroll',
    tabs: ['Employees', 'Payroll Runs'] },
  { path: '/expense-claims', name: '33-expense-claims' },
  { path: '/time-attendance', name: '34-time-attendance' },

  // ── Budget ──
  { path: '/budget', name: '35-budget',
    tabs: ['📋 Budgets', '🔮 Forecast Versions'] },

  // ── Cash Forecast ──
  { path: '/cash-forecast', name: '36-cash-forecast',
    tabs: ['Forecasts', 'Versions'] },

  // ── AI ──
  { path: '/ai-monitor', name: '37-ai-monitor' },
  { path: '/ai-forecast', name: '38-ai-forecast' },

  // ── Audit ──
  { path: '/audit-log', name: '39-audit-log' },

  // ── Tax ──
  { path: '/tax', name: '40-tax',
    tabs: ['Tax Codes', 'Transactions', 'Returns'] },

  // ── Approvals ──
  { path: '/approvals', name: '41-approvals',
    tabs: ['Workflows', 'Inbox', 'Requests'] },

  // ── Reports ──
  { path: '/reports', name: '42-reports',
    tabs: [
      'Sales by Item', 'Purchase by Item', 'Inventory Valuation', '3-Way Match',
      'Revenue vs Expenses', 'Sales vs Purchases', 'Warehouse Comparison',
      'Payment Register', 'Sales Order Summary', 'Payroll Summary',
      'Expense Claims', 'Time Attendance', 'Production Summary', 'MRP Report',
      'Executive KPI', 'Budget vs Actual', 'Cash Flow',
      'Mfg OEE', 'Prod Cost Variance', 'Sales Funnel', 'Sales Forecast',
      'Inventory Perf', 'Project Profit', 'EDI Scorecard', 'HR Cost',
      'Traceability', 'Intercompany Recon'
    ] },

  // ── Intercompany ──
  { path: '/intercompany', name: '43-intercompany' },

  // ── Phase 1 (enhancements) ──
  { path: '/phase1/recurring', name: '44-phase1-recurring',
    tabs: ['Templates', 'Generated Log'] },
  { path: '/phase1/cost-centers', name: '45-phase1-cost-centers' },
  { path: '/phase1/cost-allocation', name: '46-phase1-cost-allocation',
    tabs: ['Cost Centres', 'Allocation Rules', 'P&L Report'] },

  // ── Phase 3 (BI) ──
  { path: '/phase3/bi-dashboard', name: '47-bi-dashboard' },

  // ── Phase 4 (Platform) ──
  { path: '/phase4/permissions', name: '48-permissions' },
  { path: '/phase4/platform', name: '49-platform' },
  { path: '/phase4/workflows', name: '50-workflows' },

  // ── Webhooks ──
  { path: '/webhooks', name: '51-webhooks' },

  // ── Manufacturing ──
  { path: '/manufacturing/dashboard', name: '52-mfg-dashboard' },
  { path: '/manufacturing/boms', name: '53-mfg-boms' },
  { path: '/manufacturing/production-orders', name: '54-mfg-production-orders' },
  { path: '/manufacturing/work-centers', name: '55-mfg-work-centers' },
  { path: '/manufacturing/production-lines', name: '56-mfg-production-lines',
    tabs: ['Production Lines', 'MRP Requirements'] },

  // ── CRM ──
  { path: '/crm/dashboard', name: '57-crm-dashboard' },
  { path: '/crm/leads', name: '58-crm-leads' },
  { path: '/crm/opportunities', name: '59-crm-opportunities' },
  { path: '/crm/quotes', name: '60-crm-quotes' },

  // ── HR Portal ──
  { path: '/hr/portal', name: '61-hr-portal',
    tabs: ['Dashboard', 'Payslips', 'Leave', 'Expenses', 'Approvals'] },

  // ── Projects ──
  { path: '/projects/portal', name: '62-projects',
    tabs: ['Projects', 'Tasks', 'Time Tracking', 'Project P&L', 'Approvals'] },

  // ── EDI Invoicing ──
  { path: '/edi/invoicing', name: '63-edi',
    tabs: ['Dashboard', 'Partners', 'Outbound', 'Inbound', 'Mapping', 'Activity Log', 'Certificates', 'Acknowledgments', 'Batch'] },

  // ── Storefront (admin) ──
  { path: '/storefront', name: '64-storefront',
    tabs: ['Catalog', 'Cart', 'Orders'] },

  // ── Collaboration ──
  { path: '/collaboration', name: '65-collaboration',
    tabs: ['Team Chat', 'Activity', 'Notifications'] },

  // ── Developer Portal ──
  { path: '/developer', name: '66-developer',
    tabs: ['API Docs', 'API Keys', 'Versions'] },

  // ── Traceability ──
  { path: '/traceability', name: '67-traceability',
    tabs: ['Dashboard', 'Lots', 'Serials', 'Traceability', 'Reservations', 'Reports'] },

  // ── Documents ──
  { path: '/documents', name: '68-documents',
    tabs: ['Documents', 'Categories', 'Pending Reviews'] },

  // ── Schema Portal ──
  { path: '/schema', name: '69-schema' },

  // ── System / Admin ──
  { path: '/admin', name: '70-admin',
    tabs: ['System Health', 'Backup', 'Data Management', 'Maintenance', 'Workloads', 'Replication', 'Config', 'Synthetic Monitor', 'Query Opt', 'Notifications', 'Stack Info', 'Periods'] },
  { path: '/admin/backup', name: '71-admin-backup' },

  // ── Company ──
  { path: '/company', name: '72-company' },

  // ── Branches ──
  { path: '/branches', name: '73-branches' },

  // ── Users ──
  { path: '/users', name: '74-users' },

  // ── Demo / Simulation ──
  { path: '/demo/simulation', name: '75-demo-simulation' },
  { path: '/demo/webui', name: '76-demo-webui' },

  // ── RFID ──
  { path: '/rfid', name: '77-rfid',
    tabs: ['Tags', 'Readers', 'Reading History'] },

  // ── About / Shortcuts ──
  { path: '/about', name: '78-about' },
  { path: '/shortcuts', name: '79-shortcuts' },

  // ── Login page ──
  { path: '/login', name: '80-login' },
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function clickTab(page, tabLabel) {
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);

  // Use page.evaluate to find and click matching button in DOM
  // This bypasses Playwright's visibility/intersection checks
  const clicked = await page.evaluate((label) => {
    const btns = document.querySelectorAll('button');
    const norm = label.replace(/\s+/g, ' ').trim();
    // Exact match first
    for (const btn of btns) {
      const txt = btn.textContent.replace(/\s+/g, ' ').trim();
      if (txt === norm) {
        btn.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
        btn.click();
        return true;
      }
    }
    // Partial match (contains)
    for (const btn of btns) {
      const txt = btn.textContent.replace(/\s+/g, ' ').trim();
      if (txt.includes(norm)) {
        btn.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'nearest' });
        btn.click();
        return true;
      }
    }
    return false;
  }, tabLabel);
  return clicked;
}

async function capturePage(page, url, filepath) {
  await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(DELAY);
  // Click "Retry" if error boundary appeared
  const retryBtn = page.locator('button').filter({ hasText: 'Retry' }).first();
  if (await retryBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await retryBtn.click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: filepath, fullPage: true });
}

async function main() {
  if (fs.existsSync(OUT_DIR)) fs.rmSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  // Login
  console.log('Logging in...');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.locator('input').first().fill('admin');
  await page.locator('input[type="password"]').fill('Adm!n@2026');
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/, { timeout: 20000 });
  await page.waitForTimeout(1500);
  console.log('Logged in.\n');

  let total = 0;

  for (const route of ROUTES) {
    // Skip login if already on dashboard
    if (route.path === '/login') continue;

    // Page screenshot
    const pageFile = path.join(OUT_DIR, `${route.name}.png`);
    console.log(`  Page: ${route.path} → ${route.name}.png`);
    await capturePage(page, route.path, pageFile);
    total++;

    // Tab screenshots
    if (route.tabs) {
      for (const tabLabel of route.tabs) {
        const tabFile = path.join(OUT_DIR, `${route.name}--${slugify(tabLabel)}.png`);
        console.log(`    Tab: "${tabLabel}" → ${route.name}--${slugify(tabLabel)}.png`);

        if (await clickTab(page, tabLabel)) {
          await page.waitForTimeout(DELAY);
          await page.screenshot({ path: tabFile, fullPage: true });
          total++;
        } else {
          console.log(`    ⚠ Tab "${tabLabel}" not found, skipping`);
        }
      }
    }
  }

  // Capture login page separately
  console.log(`\n  Page: /login → 80-login.png`);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(DELAY);
  await page.screenshot({ path: path.join(OUT_DIR, '80-login.png'), fullPage: true });
  total++;

  await browser.close();
  console.log(`\nDone! ${total} screenshots saved to ${OUT_DIR}`);
}

main().catch(err => { console.error(err); process.exit(1); });
