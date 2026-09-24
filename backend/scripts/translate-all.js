#!/usr/bin/env node
/**
 * Translates posts that have no translations yet, or whose Kurdish text changed.
 *
 * New posts are translated automatically when saved; this is for the ones that
 * already existed, and for re-running after a glossary change.
 *
 *   node scripts/translate-all.js            # only what is missing or stale
 *   node scripts/translate-all.js --force    # everything, including up-to-date
 *   node scripts/translate-all.js --table news
 *
 * On Railway:
 *   railway ssh --service charity-backend "node scripts/translate-all.js"
 *
 * Human-edited translations are never overwritten — mergeTranslations keeps
 * them and only flags them stale when the Kurdish source has moved on.
 */
require('dotenv').config();
const pool = require('../db');
const { refreshTranslations, isEnabled, sourceHash, BODY_COLUMN, LANGUAGES } = require('../utils/translate');

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyTable = args.includes('--table') ? args[args.indexOf('--table') + 1] : null;
// The free tier allows ~10 requests per minute. 7s between posts keeps a
// backfill comfortably inside that; saving a single post is never affected.
const GAP_MS = Number(process.env.TRANSLATE_GAP_MS || 7000);

async function run() {
  if (!isEnabled()) {
    console.error('\nGEMINI_API_KEY is not set, so there is nothing to translate with.\n');
    process.exitCode = 1;
    return;
  }

  const tables = onlyTable ? [onlyTable] : Object.keys(BODY_COLUMN);
  let done = 0;
  let skipped = 0;
  let failed = 0;

  for (const table of tables) {
    const bodyColumn = BODY_COLUMN[table];
    if (!bodyColumn) {
      console.error(`Unknown table "${table}". Use one of: ${Object.keys(BODY_COLUMN).join(', ')}`);
      process.exitCode = 1;
      return;
    }

    const { rows } = await pool.query(
      `SELECT id, title, ${bodyColumn} AS body, translations FROM ${table} ORDER BY id`,
    );
    console.log(`\n${table}: ${rows.length} row(s)`);

    for (const row of rows) {
      const current = row.translations || {};
      const upToDate =
        current.sourceHash === sourceHash(row.title, row.body) &&
        LANGUAGES.every((l) => current[l] && !current[l].stale);

      if (upToDate && !force) {
        skipped += 1;
        console.log(`  #${row.id} up to date`);
        continue;
      }

      const before = Date.now();
      await refreshTranslations(table, row.id);

      const { rows: after } = await pool.query(`SELECT translations FROM ${table} WHERE id = $1`, [row.id]);
      const got = after[0]?.translations || {};
      const languages = LANGUAGES.filter((l) => got[l]);
      if (languages.length) {
        done += 1;
        console.log(`  #${row.id} -> ${languages.join(', ')} (${Date.now() - before}ms)`);
      } else {
        failed += 1;
        console.log(`  #${row.id} FAILED`);
      }

      await new Promise((r) => setTimeout(r, GAP_MS));
    }
  }

  console.log(`\ntranslated ${done}, skipped ${skipped}, failed ${failed}\n`);
  if (failed) process.exitCode = 1;
}

run()
  .catch((error) => {
    console.error(`\nError: ${error.message}\n`);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
