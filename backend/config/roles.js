/**
 * Role helpers.
 *
 * Roles (lowest to highest): staff < admin < super_admin.
 * - staff / admin: can manage content (hero, about, news, projects, gallery).
 * - super_admin: everything above plus staff-account management.
 *
 * SUPER_ADMINS is an optional comma-separated list of emails that are always
 * treated as super admins regardless of the role stored in the database.
 * It is read from the environment only; nothing is hardcoded here.
 */

const ROLES = ['super_admin', 'admin', 'staff'];

const SUPER_ADMIN_EMAILS = (process.env.SUPER_ADMINS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const isSuperAdmin = (user) =>
  !!user && (user.role === 'super_admin' || SUPER_ADMIN_EMAILS.includes(normalizeEmail(user.email)));

const isValidRole = (role) => ROLES.includes(role);

module.exports = { ROLES, SUPER_ADMIN_EMAILS, isSuperAdmin, isValidRole, normalizeEmail };
