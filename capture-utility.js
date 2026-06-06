/**
 * =============================================================================
 *  Page Capture Utility  —  Standalone General-Purpose Screenshot Tool
 *  v1.0
 *
 *  Loops through your project's pages, captures full-page screenshots,
 *  detects and captures each tab within tabbed pages.
 *
 *  REQUIREMENTS:
 *    - Node.js 18+
 *    - `npm install playwright` (or `npx playwright install chromium`)
 *    - Your dev server running at the configured baseUrl
 *
 *  USAGE:
 *    1. Edit the CONFIG object below (baseUrl, login, pages list)
 *    2. Run:  node capture-utility.js
 *
 *  OUTPUT STRUCTURE:
 *    screenshots/
 *      PageName/
 *        PageName.png          ← full page screenshot
 *        TabOne.png            ← after clicking first tab
 *        TabTwo.png            ← after clicking second tab
 *        ...
 *
 *  TAB DISCOVERY (3 modes):
 *    string[]       → click buttons matching exact visible text
 *    { selector }   → auto-find all elements matching CSS selector, click each
 *    { labels, selector } → find via selector, match by label text
 *    omit / null    → page has no sub-tabs
 * =============================================================================
 */

const { chromium } = require('playwright');
const fs   = require('fs');
const path = require('path');

// ═════════════════════════════════════════════════════════════════════════════
//  C O N F I G U R A T I O N
//  ───────────────────────────
//  Edit these values to match your project.
// ═════════════════════════════════════════════════════════════════════════════

const CONFIG = {

  /* ── App connection ──────────────────────────────────────────────────── */
  baseUrl:    'http://localhost:3000',          // no trailing slash
  outputDir:  'screenshots',
  viewport:   { width: 1920, height: 1080 },
  delay:      2000,                              // ms between captures

  /* ── Optional login block ────────────────────────────────────────────── */
  login: {
    url:            '/login',
    fields: [
      { selector: 'input[type="text"], input:not([type])',  type: 'fill',  value: 'admin' },
      { selector: 'input[type="password"]',                 type: 'fill',  value: 'Adm!n@2026' },
    ],
    submitButton:   'button:has-text("Sign In"), button[type="submit"], button:has-text("Login")',
    waitFor:        '/dashboard',       // URL fragment to confirm login, or null
  },

  /* ── Pages to capture ────────────────────────────────────────────────── */
  pages: [   // { route, name, tabs? }

    // ── Add your own pages below (remove the demo entries) ────────────────
    // { route: '/dashboard',   name: 'Dashboard' },
    // { route: '/profile',     name: 'Profile',   tabs: ['Settings', 'Security'] },
    // { route: '/reports',     name: 'Reports',   tabs: { selector: '[role="tab"]' } },

    /* Demo entries — replace with your project's pages */
    { route: '/dashboard', name: 'Dashboard' },
    { route: '/budget',    name: 'Budget',  tabs: ['Budgets', 'Forecast'] },
    { route: '/projects',  name: 'Projects',tabs: ['Projects', 'Tasks', 'Time', 'P&L', 'Approvals'] },
  ],
};

// ═════════════════════════════════════════════════════════════════════════════
//  C O R E  E N G I N E
//  ─────────────────────
//  No edits needed below this line.
// ═════════════════════════════════════════════════════════════════════════════

function slugify(text) {
  return text.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '') || 'tab';
}
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function clickByText(page, text) {
  return page.evaluate((label) => {
    const norm = s => s.replace(/\s+/g, ' ').trim();
    for (const btn of document.querySelectorAll('button, [role="tab"], [role="button"], a')) {
      if (norm(btn.textContent) === norm(label)) { btn.scrollIntoView({block:'center'}); btn.click(); return true; }
    }
    return false;
  }, text);
}

async function captureTabsByLabels(page, pageName, labels, outDir) {
  const done = [];
  for (const label of labels) {
    if (typeof label !== 'string') continue;
    const fp = path.join(outDir, pageName, `${slugify(label)}.png`);
    const ok = await clickByText(page, label);
    if (!ok) { console.log(`  ⚠ Tab "${label}" not found`); continue; }
    await sleep(CONFIG.delay);
    await page.screenshot({ path: fp, fullPage: true });
    done.push(label);
    console.log(`  ✓ Tab  "${label}"`);
  }
  return done;
}

async function captureTabsBySelector(page, pageName, cfg, outDir) {
  const sel = cfg.selector, labels = cfg.labels || null;
  if (!sel) return [];
  const done = [];
  const count = await page.locator(sel).count();
  for (let i = 0; i < count; i++) {
    const raw = (await page.locator(sel).nth(i).textContent()) || `tab-${i}`;
    const lbl = labels ? labels[i] || raw : raw;
    const fp  = path.join(outDir, pageName, `${slugify(lbl)}.png`);
    try {
      if (labels) { await clickByText(page, lbl); }
      else        { await page.locator(sel).nth(i).click({ force: true }); }
      await sleep(CONFIG.delay);
      await page.screenshot({ path: fp, fullPage: true });
      done.push(lbl);
      console.log(`  ✓ Tab  "${lbl}"`);
    } catch (e) {
      console.log(`  ⚠ Tab ${i} error: ${e.message}`);
    }
  }
  return done;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════╗');
  console.log('║  Page Capture Utility  v1.0  ║');
  console.log('╚══════════════════════════════╝');
  console.log(`  Target  : ${CONFIG.baseUrl}`);
  console.log(`  Output  : ${CONFIG.outputDir}`);
  console.log(`  Pages   : ${CONFIG.pages.length}`);
  console.log(`  Delay   : ${CONFIG.delay}ms\n`);

  ensureDir(CONFIG.outputDir);
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: CONFIG.viewport });
  const page = await ctx.newPage();

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  let ss = 0, pi = 0, ti = 0, fail = 0;

  try {
    /* Login */
    if (CONFIG.login) {
      console.log('── Login ───────────────────────────────');
      const L = CONFIG.login;
      await page.goto(`${CONFIG.baseUrl}${L.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);
      for (const f of L.fields) {
        if (f.type === 'fill') await page.locator(f.selector).fill(f.value);
        else await page.locator(f.selector).pressSequentially(f.value);
      }
      await page.locator(L.submitButton).click();
      if (L.waitFor) await page.waitForURL(`**${L.waitFor}`, { timeout: 20000 });
      else await page.waitForTimeout(3000);
      console.log('  ✓ Logged in\n');
    }

    /* Pages */
    for (const p of CONFIG.pages) {
      const dir = path.join(CONFIG.outputDir, p.name);
      ensureDir(dir);
      const fp = path.join(dir, `${p.name}.png`);

      console.log(`── ${p.name} (${p.route}) ───────────────────`);
      try {
        await page.goto(`${CONFIG.baseUrl}${p.route}`, { waitUntil: 'networkidle', timeout: 20000 });
      } catch {
        console.log('  ⚠ Navigation timeout (capturing partial render)');
      }
      await sleep(CONFIG.delay);
      await page.screenshot({ path: fp, fullPage: true });
      ss++; pi++;
      console.log(`  ✓ Page`);

      let tc = 0;
      if (p.tabs) {
        if (Array.isArray(p.tabs))       tc = (await captureTabsByLabels(page, p.name, p.tabs, CONFIG.outputDir)).length;
        else if (p.tabs?.selector)       tc = (await captureTabsBySelector(page, p.name, p.tabs, CONFIG.outputDir)).length;
        ss += tc; ti += tc;
      }

      if (errors.length) {
        console.log(`  ⚠ ${errors.length} error(s): ${errors.slice(-2).join('; ')}`);
        errors.length = 0;
      }
      console.log(`  → ${1+tc} screenshot(s)\n`);
    }
  } catch (e) {
    console.error(`\n✗ ${e.message}`);
    fail = CONFIG.pages.length - pi;
  } finally {
    await browser.close();
  }

  console.log('╔══════════════════════════════╗');
  console.log('║  Done                        ║');
  console.log('╚══════════════════════════════╝');
  console.log(`  Pages       : ${pi}`);
  console.log(`  Tabs        : ${ti}`);
  console.log(`  Screenshots : ${ss}`);
  if (fail) console.log(`  Failed      : ${fail}`);
  console.log(`  Output      : ${CONFIG.outputDir}/\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
