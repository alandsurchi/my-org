import { test, expect } from '@playwright/test';
import { loginAsAdmin, apiToken, createProject, deleteProject, openDashboardTab, ADMIN_PASSWORD } from './helpers';

test.describe('staff login and dashboard', () => {
  test('wrong password is rejected, right password reaches the dashboard', async ({ page }) => {
    await page.goto('/staff-login');
    await page.getByLabel('Staff Email').fill('admin@charity.com');
    await page.getByLabel('Password', { exact: true }).fill('definitely-wrong');
    await page.getByRole('button', { name: /Access Staff Dashboard/i }).click();
    await expect(page.getByText(/Invalid credentials/i).first()).toBeVisible();

    await loginAsAdmin(page);
    await expect(page.getByRole('heading', { name: 'Staff Dashboard' })).toBeVisible();
    await expect(page.getByText('Website visitors')).toBeVisible();
  });

  test('dashboard tabs open and the staff tab has password and backup tools', async ({ page }) => {
    await loginAsAdmin(page);
    await openDashboardTab(page, 'چاڵاکیەکان');
    await expect(page.getByText('Project Management')).toBeVisible();
    await openDashboardTab(page, 'هەواڵەکان');
    await expect(page.getByText('Dynamic News Section')).toBeVisible();
    await openDashboardTab(page, 'وێنەکان');
    await expect(page.getByText('Upload New Photo')).toBeVisible();
    await openDashboardTab(page, 'ستاف');
    await expect(page.getByText('My password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Download backup/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Add New Staff Member/i })).toBeVisible();
  });

  test('a project can be edited from the dashboard and the change reaches the public site', async ({ page, request }) => {
    const token = await apiToken(request);
    const project = await createProject(request, token, 'E2E well project');
    try {
      await loginAsAdmin(page);
      await openDashboardTab(page, 'چاڵاکیەکان');
      await page.getByRole('button', { name: /Show All Projects/i }).click();
      const card = page.locator('h3', { hasText: 'E2E well project' }).locator('xpath=ancestor::*[contains(@class,"rounded-2xl")][1]');
      await card.getByRole('button', { name: 'Edit this project' }).click();

      const dialog = page.getByRole('dialog');
      await expect(dialog.getByRole('heading', { name: 'Edit project' })).toBeVisible();
      await dialog.getByLabel('Title').fill('E2E well project (edited)');
      await dialog.getByLabel('Location').fill('Soran');
      await dialog.getByRole('button', { name: /Save changes/i }).click();
      await expect(dialog).toBeHidden();

      const res = await request.get(`/api/projects/${project.id}`);
      const data = (await res.json()).data;
      expect(data.title).toBe('E2E well project (edited)');
      expect(data.location).toBe('Soran');

      await page.goto('/projects');
      await expect(page.getByText('E2E well project (edited)')).toBeVisible();
    } finally {
      await deleteProject(request, token, project.id);
    }
  });

  test('changing the own password works and the old one stops working', async ({ page, request }) => {
    await loginAsAdmin(page);
    await openDashboardTab(page, 'ستاف');
    await page.getByLabel('Current password').fill(ADMIN_PASSWORD);
    await page.getByLabel('New password', { exact: true }).fill('E2eTempPass123');
    await page.getByLabel('Repeat new password').fill('E2eTempPass123');
    await page.getByRole('button', { name: /Change password/i }).click();
    await expect(page.getByText('Password changed').first()).toBeVisible();

    const old = await request.post('/api/auth/login', { data: { email: 'admin@charity.com', password: ADMIN_PASSWORD } });
    expect(old.status()).toBe(401);
    const fresh = await request.post('/api/auth/login', { data: { email: 'admin@charity.com', password: 'E2eTempPass123' } });
    expect(fresh.ok()).toBeTruthy();
    // restore so the other tests keep working
    const token = (await fresh.json()).token as string;
    const restore = await request.post('/api/auth/change-password', {
      headers: { Authorization: `Bearer ${token}` },
      data: { currentPassword: 'E2eTempPass123', newPassword: ADMIN_PASSWORD },
    });
    expect(restore.ok()).toBeTruthy();
  });

  test('logout returns to the home page and protects the dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    await page.getByRole('button', { name: /Logout/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/staff-login/);
  });
});
