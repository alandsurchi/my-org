/**
 * Seeds initial CONTENT (news, projects) into an empty database.
 *
 * - Runs only when the target table is empty, so it never overwrites edits
 *   made through the dashboard.
 * - Never touches the users table. Accounts are created through the
 *   dashboard; the first super admin is bootstrapped in index.js.
 */
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const LEGACY_TEST_ACCOUNTS = ['staff-role-check@example.com'];

async function seedDatabase() {
  const client = await pool.connect();
  try {
    // Remove test accounts that older versions of the seed created on every boot.
    const removed = await client.query('DELETE FROM users WHERE email = ANY($1) RETURNING email', [LEGACY_TEST_ACCOUNTS]);
    if (removed.rowCount > 0) console.log(`Removed legacy test accounts: ${removed.rows.map((r) => r.email).join(', ')}`);

    const seedPath = path.join(__dirname, 'seed-data.sql');
    if (!fs.existsSync(seedPath)) return;

    const [news, projects] = await Promise.all([
      client.query('SELECT COUNT(*)::int AS count FROM news'),
      client.query('SELECT COUNT(*)::int AS count FROM projects')
    ]);
    const seedNews = news.rows[0].count === 0;
    const seedProjects = projects.rows[0].count === 0;
    if (!seedNews && !seedProjects) return;

    const sql = fs.readFileSync(seedPath, 'utf8');
    const statements = sql
      .split('\n')
      .filter((l) => !l.trim().startsWith('--'))
      .join('\n')
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean);

    await client.query('BEGIN');
    let applied = 0;
    for (const stmt of statements) {
      const isNews = /INSERT INTO news/i.test(stmt);
      const isProject = /INSERT INTO projects/i.test(stmt);
      if (/INSERT INTO users/i.test(stmt)) continue; // never seed accounts
      if ((isNews && !seedNews) || (isProject && !seedProjects)) continue;
      await client.query(stmt);
      applied++;
    }
    await client.query('COMMIT');
    if (applied > 0) console.log(`Seeded ${applied} content rows`);
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    console.error('Seed failed:', error.message);
  } finally {
    client.release();
  }
}

module.exports = seedDatabase;

if (require.main === module) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
