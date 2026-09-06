import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Serious and critical WCAG issues fail the build; minor ones are reported only.
const FAIL_ON = ['serious', 'critical'];

for (const path of ['/', '/projects', '/news', '/gallery', '/staff-login']) {
  test(`no serious accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForTimeout(500);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      // decorative overlays on the hero photo are intentionally low-contrast art, not text
      .exclude('#home .animate-ping')
      .analyze();
    const serious = results.violations.filter((v) => FAIL_ON.includes(v.impact || ''));
    if (results.violations.length) {
      console.log(`${path}: ${results.violations.map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`).join(', ')}`);
    }
    expect(serious, serious.map((v) => `${v.id}: ${v.help} -> ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`).join('\n')).toEqual([]);
  });
}
