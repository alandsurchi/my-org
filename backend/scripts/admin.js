#!/usr/bin/env node
/**
 * Account management from outside the website.
 *
 * The dashboard can only manage staff once you are already signed in, and the
 * "forgot password" email is disabled while no mail service is configured. This
 * script is the way back in, and the way to add people without the website.
 *
 *   node scripts/admin.js list
 *   node scripts/admin.js create someone@example.org --name "Full Name" --role admin
 *   node scripts/admin.js reset someone@example.org
 *   node scripts/admin.js role someone@example.org super_admin
 *   node scripts/admin.js delete someone@example.org --yes
 *
 * Passwords are generated and printed ONCE unless you pass --password. They are
 * never stored in plain text and never logged anywhere else.
 *
 * On Railway the database is only reachable from inside the project, so run it
 * through the container:
 *
 *   railway ssh --service charity-backend "node scripts/admin.js list"
 */
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const ROLES = ['super_admin', 'admin', 'staff'];
const MIN_PASSWORD_LENGTH = 8; // matches staffCreateValidation in middleware/validator.js

const bold = (s) => `\u001b[1m${s}\u001b[0m`;
const dim = (s) => `\u001b[2m${s}\u001b[0m`;

function fail(message) {
  console.error(`\nError: ${message}\n`);
  process.exitCode = 1;
  return null;
}

/** ~26 characters of base64url — far beyond anything worth guessing. */
const generatePassword = () => crypto.randomBytes(20).toString('base64url');

/** Parses `--flag value` and `--flag=value`, leaving positional args in order. */
function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith('--')) {
      positional.push(arg);
      continue;
    }
    const [name, inline] = arg.slice(2).split(/=(.*)/s);
    if (inline !== undefined) {
      flags[name] = inline;
    } else if (argv[i + 1] && !argv[i + 1].startsWith('--')) {
      flags[name] = argv[i + 1];
      i += 1;
    } else {
      flags[name] = true;
    }
  }
  return { positional, flags };
}

const normaliseEmail = (email) => String(email || '').trim().toLowerCase();

async function findUser(email) {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, last_login, created_at FROM users WHERE email = $1',
    [email],
  );
  return rows[0] || null;
}

async function countSuperAdmins(excludingId) {
  const { rows } = await pool.query(
    "SELECT COUNT(*)::int AS count FROM users WHERE role = 'super_admin' AND id <> $1",
    [excludingId || 0],
  );
  return rows[0].count;
}

/** Shown after any command that produces a password. */
function announcePassword(email, password) {
  console.log(`\n  ${bold('Email')}    ${email}`);
  console.log(`  ${bold('Password')} ${password}`);
  console.log(dim('\n  Shown once. Copy it now, then change it after signing in.\n'));
}

function resolvePassword(flags) {
  if (flags.password === undefined || flags.password === true) {
    return { password: generatePassword(), generated: true };
  }
  const password = String(flags.password);
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` };
  }
  return { password, generated: false };
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

async function list() {
  const { rows } = await pool.query(
    'SELECT id, name, email, role, last_login FROM users ORDER BY role, email',
  );
  if (rows.length === 0) {
    console.log('\nNo accounts exist yet. Create one with:  node scripts/admin.js create you@example.org --role super_admin\n');
    return;
  }
  const width = (key, min) => Math.max(min, ...rows.map((r) => String(r[key] || '').length));
  const w = { email: width('email', 5), name: width('name', 4), role: width('role', 4) };
  console.log(`\n${bold('ID'.padEnd(4) + 'EMAIL'.padEnd(w.email + 2) + 'NAME'.padEnd(w.name + 2) + 'ROLE'.padEnd(w.role + 2) + 'LAST SIGN-IN')}`);
  for (const r of rows) {
    const last = r.last_login ? new Date(r.last_login).toISOString().slice(0, 16).replace('T', ' ') : 'never';
    console.log(
      String(r.id).padEnd(4) +
      r.email.padEnd(w.email + 2) +
      String(r.name || '').padEnd(w.name + 2) +
      r.role.padEnd(w.role + 2) +
      last,
    );
  }
  console.log(dim(`\n${rows.length} account(s).\n`));
}

async function create(positional, flags) {
  const email = normaliseEmail(positional[0]);
  if (!email || !email.includes('@')) return fail('Give a valid email: create someone@example.org');
  if (await findUser(email)) return fail(`${email} already exists. Use "reset" to change its password.`);

  const role = flags.role ? String(flags.role) : 'staff';
  if (!ROLES.includes(role)) return fail(`Role must be one of: ${ROLES.join(', ')}`);

  const name = flags.name ? String(flags.name) : email.split('@')[0];
  if (name.length < 2) return fail('Name must be at least 2 characters');

  const resolved = resolvePassword(flags);
  if (resolved.error) return fail(resolved.error);

  const hashed = await bcrypt.hash(resolved.password, 10);
  await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
    [name, email, hashed, role],
  );
  console.log(`\nCreated ${bold(email)} as ${bold(role)}.`);
  if (resolved.generated) announcePassword(email, resolved.password);
  else console.log(dim('\n  Password set to the one you supplied.\n'));
}

async function reset(positional, flags) {
  const email = normaliseEmail(positional[0]);
  const user = await findUser(email);
  if (!user) return fail(`No account for ${email}. Run "list" to see what exists.`);

  const resolved = resolvePassword(flags);
  if (resolved.error) return fail(resolved.error);

  const hashed = await bcrypt.hash(resolved.password, 10);
  await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
  console.log(`\nPassword reset for ${bold(email)} (${user.role}).`);
  if (resolved.generated) announcePassword(email, resolved.password);
  else console.log(dim('\n  Password set to the one you supplied.\n'));
}

async function role(positional) {
  const email = normaliseEmail(positional[0]);
  const next = String(positional[1] || '');
  if (!ROLES.includes(next)) return fail(`Role must be one of: ${ROLES.join(', ')}`);

  const user = await findUser(email);
  if (!user) return fail(`No account for ${email}`);
  if (user.role === next) return fail(`${email} is already ${next}`);

  // Losing the last super admin would lock everyone out of staff management.
  if (user.role === 'super_admin' && next !== 'super_admin' && (await countSuperAdmins(user.id)) === 0) {
    return fail(`${email} is the only super admin. Promote someone else first.`);
  }

  await pool.query('UPDATE users SET role = $1 WHERE id = $2', [next, user.id]);
  console.log(`\n${bold(email)}: ${user.role} -> ${bold(next)}\n`);
}

async function remove(positional, flags) {
  const email = normaliseEmail(positional[0]);
  const user = await findUser(email);
  if (!user) return fail(`No account for ${email}`);
  if (!flags.yes) return fail(`This permanently deletes ${email}. Re-run with --yes to confirm.`);
  if (user.role === 'super_admin' && (await countSuperAdmins(user.id)) === 0) {
    return fail(`${email} is the only super admin. Promote someone else first.`);
  }

  await pool.query('DELETE FROM users WHERE id = $1', [user.id]);
  console.log(`\nDeleted ${bold(email)}.\n`);
}

function usage() {
  console.log(`
${bold('Mrovdostan account management')}

  node scripts/admin.js list
  node scripts/admin.js create <email> [--name "Full Name"] [--role staff|admin|super_admin] [--password "..."]
  node scripts/admin.js reset  <email> [--password "..."]
  node scripts/admin.js role   <email> <staff|admin|super_admin>
  node scripts/admin.js delete <email> --yes

${dim('Without --password a strong one is generated and printed once.')}
${dim('On Railway:  railway ssh --service charity-backend "node scripts/admin.js list"')}
`);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const command = positional.shift();

  if (!process.env.DATABASE_URL) {
    return fail('DATABASE_URL is not set. Run this inside Railway, or from backend/ with a .env file.');
  }

  switch (command) {
    case 'list': return list();
    case 'create': return create(positional, flags);
    case 'reset': return reset(positional, flags);
    case 'role': return role(positional);
    case 'delete': return remove(positional, flags);
    default:
      usage();
      if (command) process.exitCode = 1;
      return undefined;
  }
}

main()
  .catch((error) => {
    console.error(`\nError: ${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
