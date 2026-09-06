import { expect, type APIRequestContext, type Page } from '@playwright/test';

export const ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@charity.com').toLowerCase();
export const ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || '';

/** Logs in through the real login form and waits for the dashboard. */
export async function loginAsAdmin(page: Page) {
  await page.goto('/staff-login');
  await page.getByLabel('Staff Email').fill(ADMIN_EMAIL);
  await page.getByLabel('Password', { exact: true }).fill(ADMIN_PASSWORD);
  await page.getByRole('button', { name: /Access Staff Dashboard/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

/** API token for seeding data directly. */
export async function apiToken(request: APIRequestContext) {
  const res = await request.post('/api/auth/login', { data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD } });
  expect(res.ok()).toBeTruthy();
  return (await res.json()).token as string;
}

/** Creates a project through the API so the UI has something to show. */
export async function createProject(request: APIRequestContext, token: string, title: string) {
  const res = await request.post('/api/projects', {
    headers: { Authorization: `Bearer ${token}` },
    multipart: { title, description: `${title} description for the e2e run.`, category: 'water', status: 'active', location: 'Erbil' },
  });
  expect(res.status()).toBe(201);
  return (await res.json()).data as { id: number };
}

export async function deleteProject(request: APIRequestContext, token: string, id: number) {
  await request.delete(`/api/projects/${id}`, { headers: { Authorization: `Bearer ${token}` } });
}

/** Radix tabs activate on pointer down; a plain click is enough in a real browser. */
export async function openDashboardTab(page: Page, label: string) {
  await page.getByRole('tab', { name: label }).click();
  await expect(page.getByRole('tab', { name: label })).toHaveAttribute('data-state', 'active');
}
