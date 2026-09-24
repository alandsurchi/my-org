import { test, expect } from '@playwright/test';

test.describe('public site', () => {
  test('home page renders every section and talks to the API', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Mrovdostan/);
    for (const id of ['home', 'about', 'projects', 'news', 'gallery']) {
      await expect(page.locator(`section#${id}`)).toBeVisible();
    }
    await expect(page.getByText(/Connection error|Failed to fetch/i)).toHaveCount(0);
    // the API health check made through the same origin must succeed
    const health = await page.request.get('/api/health');
    expect(health.ok()).toBeTruthy();
  });

  test('no untranslated keys leak into the page', async ({ page }) => {
    await page.goto('/');
    await page.locator('section#news').scrollIntoViewIfNeeded();
    // t() returns the key itself when a translation is missing, so a missing key
    // renders as camelCase text like "visitors" or "visitorsToOrg" rather than
    // failing loudly. Tab labels are where that surfaced.
    const labels = await page.locator('section#news [role="tab"]').allInnerTexts();
    expect(labels.length).toBeGreaterThan(0);
    for (const label of labels) {
      expect(label.trim(), `"${label}" looks like an untranslated translation key`)
        .not.toMatch(/^[a-z]+[A-Z][a-zA-Z]*$/);
      expect(label.trim()).not.toBe('visitors');
    }
  });

  test('sections become visible when scrolled into view', async ({ page }) => {
    await page.goto('/');
    await page.locator('section#news').scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('.fade-in-on-scroll')].filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top < innerHeight && r.bottom > 0 && getComputedStyle(el).opacity === '0';
      }).length
    );
    expect(hidden).toBe(0);
  });

  test('language switch changes direction and text', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await page.evaluate(() => localStorage.setItem('language', 'en'));
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
    await expect(page.locator('section#home h1')).toHaveText(/MROVDOSTAN/);
  });

  test('dark mode toggle is remembered', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Switch to dark mode/i }).click();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.reload();
    await expect(page.locator('html')).toHaveClass(/dark/);
    await page.getByRole('button', { name: /Switch to light mode/i }).click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  for (const path of ['/projects', '/news', '/gallery']) {
    test(`${path} page loads with its own title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(/\| Mrovdostan$/);
      await expect(page.locator('section#main-content')).toBeVisible();
      await expect(page.getByText(/Could not load/i)).toHaveCount(0);

      // One breadcrumb trail, first crumb home, last crumb the current page.
      const crumbs = page.locator('nav[aria-label] ol').first();
      await expect(crumbs).toHaveCount(1);
      await expect(crumbs.locator('a[href="/"]')).toHaveCount(1);
      await expect(crumbs.locator('[aria-current="page"]')).toHaveCount(1);
    });

    test(`${path} images all carry alt text`, async ({ page }) => {
      await page.goto(path);
      await page.waitForTimeout(500);
      // axe's image-alt rule only fires on a MISSING alt attribute, never an
      // empty one, so an empty alt on a real photo is invisible to it.
      const bare = await page
        .locator('section img[alt=""]')
        .evaluateAll((els) => els.filter((el) => !el.closest('[aria-hidden="true"]')).length);
      expect(bare).toBe(0);
    });
  }

  test('the privacy policy is reachable and readable', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveTitle(/\| Mrovdostan$/);
    await expect(page.locator('section#main-content')).toBeVisible();
    // Nine policy sections, in whichever language is active.
    expect(await page.locator('h2').count()).toBeGreaterThanOrEqual(6);
  });

  test('the footer links to the privacy policy on every page', async ({ page }) => {
    await page.goto('/');
    // Located by href, not by name: the default language is Kurdish.
    const link = page.getByRole('contentinfo').locator('a[href="/privacy"]');
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(/\/privacy$/);
  });

  test('unknown page shows the 404 view and offers a way onward', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    for (const href of ['/projects', '/news', '/gallery']) {
      await expect(page.locator(`a[href="${href}"]`).first()).toHaveCount(1);
    }
  });

  test('crawler metadata is served per route', async ({ request }) => {
    const html = await (await request.get('/news')).text();
    expect(html).toContain('<title>All News | Mrovdostan</title>');
    expect(html).toMatch(/<link rel="canonical" href="http:\/\/127\.0\.0\.1:\d+\/news"/);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap:');
    expect(robots).toContain('Disallow: /forgot-password');
    expect(robots).toContain('Disallow: /reset-password');
    // robots.txt is world-readable, so it must never name the secret staff path.
    expect(robots).not.toContain(process.env.VITE_SECRET_STAFF_PATH || 'log-org');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>');
    expect(sitemap).toContain('/privacy');
    const privacy = await (await request.get('/privacy')).text();
    expect(privacy).toContain('<title>Privacy Policy | Mrovdostan</title>');
  });

  test('structured data is scoped to the right routes', async ({ request }) => {
    const home = await (await request.get('/')).text();
    expect(home).toContain('"@type":"FAQPage"');
    // A page is not its own ancestor: no breadcrumb trail on the home page.
    expect(home).not.toContain('"@type":"BreadcrumbList"');
    // Proves the literal origin swap ran; a broken swap is otherwise invisible.
    expect(home).not.toContain('https://mrovdostan.org');
    expect(home).toContain('og:image:alt');
    expect(home).toContain('og:locale');
    expect((home.match(/og:locale:alternate/g) || []).length).toBe(2);

    const projects = await (await request.get('/projects')).text();
    expect(projects).toContain('"@type":"BreadcrumbList"');
    expect(projects).toContain('"position":2');
    expect(projects).not.toContain('"@type":"FAQPage"');
  });

  test('every post has its own page, title and structured data', async ({ page, request }) => {
    // The sitemap is built from live content, so it tells us what exists.
    const sitemap = await (await request.get('/sitemap.xml')).text();
    const postUrl = sitemap.match(/<loc>[^<]*(\/(?:news|projects)\/\d+)<\/loc>/)?.[1];
    expect(postUrl, 'sitemap should list individual posts, not just the static pages').toBeTruthy();

    const html = await (await request.get(postUrl!)).text();
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
    // Its own title, not the home page's — the whole point of giving posts URLs.
    expect(title).toMatch(/\| Mrovdostan$/);
    expect(title).not.toBe('Mrovdostan Organization for Humanitarian Aid');
    expect(html).toContain('"@type":"BreadcrumbList"');
    expect(html).toMatch(/"@type":"(NewsArticle|CreativeWork)"/);
    expect(html).toContain('"position":3');

    await page.goto(postUrl!);
    await expect(page.locator('section#main-content')).toBeVisible();
    await expect(page.locator('article')).toHaveCount(1);
  });

  test('a post that does not exist is kept out of the index', async ({ request }) => {
    const html = await (await request.get('/news/99999999')).text();
    expect(html).toContain('noindex');
  });

  test('cards link to real addresses instead of opening dialogs', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForTimeout(500);
    const first = page.locator('article a[href^="/projects/"]').first();
    await expect(first).toHaveCount(1);
    const href = await first.getAttribute('href');
    await first.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
  });

  test('the FAQ markup and its structured data stay in step', async ({ page, request }) => {
    // server.mjs cannot import from src/ (the image ships only dist/ and
    // server.mjs), so its copy of the questions is duplicated on purpose. This
    // catches the day someone adds a sixth question to only one of them.
    const html = await (await request.get('/')).text();
    const inSchema = (html.match(/"@type":"Question"/g) || []).length;
    expect(inSchema).toBe(5);
    await page.goto('/');
    await expect(page.locator('#faq button[data-state]')).toHaveCount(inSchema);
  });
});
