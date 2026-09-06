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
    });
  }

  test('unknown page shows the 404 view', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('crawler metadata is served per route', async ({ request }) => {
    const html = await (await request.get('/news')).text();
    expect(html).toContain('<title>All News | Mrovdostan</title>');
    expect(html).toMatch(/<link rel="canonical" href="http:\/\/127\.0\.0\.1:\d+\/news"/);
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap:');
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('<loc>');
  });
});
