/**
 * Machine translation of post content, Kurdish (Sorani) -> English + Arabic.
 *
 * Posts are written in Kurdish. Without this, an English or Arabic visitor sees
 * the Kurdish text, which made the language switcher cosmetic for everything
 * except the interface strings.
 *
 * Provider: Google Gemini, behind one function, so swapping it is a local
 * change. Disabled entirely when GEMINI_API_KEY is unset — saving a post still
 * works, it just stores no translations.
 */
const crypto = require('crypto');
const pool = require('../db');

const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const TIMEOUT_MS = 20000;
const MAX_ATTEMPTS = 3;
// A 503 clears in a moment; a 429 is a PER-MINUTE quota, so retrying after one
// second just burns another request. The waits differ by cause for that reason.
const RETRY_DELAYS_MS = { transient: [1500, 4000], rateLimit: [20000, 35000] };

const LANGUAGES = ['en', 'ar'];
const LANGUAGE_NAMES = { en: 'English', ar: 'Arabic' };

const isEnabled = () => !!process.env.GEMINI_API_KEY;

/** Identifies the Kurdish source, so we can tell when a translation went stale. */
const sourceHash = (title, body) =>
  crypto.createHash('sha256').update(`${title || ''}\u0000${body || ''}`).digest('hex').slice(0, 32);

/** Glossary rows whose term actually appears in this text. */
async function relevantGlossary(text) {
  try {
    const { rows } = await pool.query('SELECT term, en, ar FROM glossary');
    return rows.filter((r) => text.includes(r.term));
  } catch {
    return []; // A missing glossary table must not block translating.
  }
}

function buildPrompt(title, body, glossary) {
  const terms = glossary.length
    ? `\nThese are names. Use exactly these forms — do not translate, re-spell or transliterate them differently:\n${glossary
        .map((g) => `  "${g.term}" -> English: "${g.en}", Arabic: "${g.ar}"`)
        .join('\n')}\n`
    : '';

  return `You translate content for a humanitarian NGO's website from Central Kurdish (Sorani) into English and Arabic.

Rules:
- Preserve line breaks, parentheses, separator lines and date formats exactly as they appear.
- Keep the tone factual and plain, suitable for a public news post.
- Do not add, remove or explain anything.
- Treat personal names, organisations, villages, centres and hospitals as names, not words to translate.
${terms}
Return ONLY valid JSON in exactly this shape:
{"en":{"title":"...","body":"..."},"ar":{"title":"...","body":"..."}}

Title (Kurdish): ${title || '(none)'}
Body (Kurdish):
${body || '(none)'}`;
}

/**
 * Translates one post. Returns null when translation is off or fails — callers
 * treat that as "no translations available", never as a save failure.
 */
async function translatePost(title, body) {
  if (!isEnabled()) return null;
  const text = `${title || ''}\n${body || ''}`.trim();
  if (!text) return null;

  const glossary = await relevantGlossary(text);
  const url = `${ENDPOINT}/${MODEL}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;
  const requestBody = JSON.stringify({
    contents: [{ parts: [{ text: buildPrompt(title, body, glossary) }] }],
    // Low temperature: this is translation, not composition.
    generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
  });

  // 503 (model overloaded) and 429 (rate limited) are routine and transient.
  // Giving up on the first one would silently leave posts untranslated.
  const RETRYABLE = new Set([429, 500, 502, 503, 504]);

  let waits = RETRY_DELAYS_MS.transient;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, waits[attempt - 1]));

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        // Never log the message verbatim — Google echoes the key back in some errors.
        const status = detail?.error?.status || '';
        if (RETRYABLE.has(res.status) && attempt < MAX_ATTEMPTS - 1) {
          waits = res.status === 429 ? RETRY_DELAYS_MS.rateLimit : RETRY_DELAYS_MS.transient;
          const seconds = Math.round(waits[attempt] / 1000);
          console.warn(`Translation attempt ${attempt + 1} failed (HTTP ${res.status} ${status}); retrying in ${seconds}s.`);
          continue;
        }
        console.error(`Translation failed: HTTP ${res.status} ${status}`);
        return null;
      }

      const payload = await res.json();
      const raw = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) return null;

      const parsed = JSON.parse(raw);
      const out = { sourceHash: sourceHash(title, body) };
      for (const lang of LANGUAGES) {
        const got = parsed[lang];
        if (!got || (!got.title && !got.body)) continue;
        out[lang] = {
          title: String(got.title || '').trim(),
          body: String(got.body || '').trim(),
          auto: true,
          stale: false,
          at: new Date().toISOString(),
        };
      }
      return Object.keys(out).length > 1 ? out : null;
    } catch (error) {
      const transient = error.name === 'TimeoutError';
      if (transient && attempt < MAX_ATTEMPTS - 1) {
        console.warn(`Translation attempt ${attempt + 1} timed out; retrying.`);
        continue;
      }
      console.error('Translation error:', transient ? 'timed out' : error.message);
      return null;
    }
  }
  return null;
}

/**
 * Decides what the stored translations should become after a save.
 *
 * A human edit (auto: false) is never overwritten. If the Kurdish source
 * changed underneath one, it is kept but marked stale so the dashboard can show
 * that it needs another look.
 */
async function mergeTranslations(existing, title, body) {
  const hash = sourceHash(title, body);
  const current = existing && typeof existing === 'object' ? existing : {};

  if (current.sourceHash === hash) return current; // Source unchanged: nothing to do.

  const fresh = await translatePost(title, body);
  if (!fresh) {
    // Could not translate: keep what we have, but do not pretend it is current.
    const kept = { ...current, sourceHash: current.sourceHash };
    for (const lang of LANGUAGES) {
      if (kept[lang]) kept[lang] = { ...kept[lang], stale: true };
    }
    return Object.keys(kept).length ? kept : null;
  }

  const merged = { sourceHash: hash };
  for (const lang of LANGUAGES) {
    const human = current[lang] && current[lang].auto === false;
    if (human) {
      merged[lang] = { ...current[lang], stale: true };
    } else if (fresh[lang]) {
      merged[lang] = fresh[lang];
    }
  }
  return merged;
}

/** Which column holds the body text for each translatable table. */
const BODY_COLUMN = { news: 'content', projects: 'description' };

/**
 * Re-translates one row and writes the result back.
 *
 * Deliberately NOT awaited by the save handlers: a translation round trip takes
 * several seconds, and making the dashboard's Save button hang that long would
 * feel broken. The post is stored immediately and the translations land a
 * moment later.
 */
async function refreshTranslations(table, id) {
  const bodyColumn = BODY_COLUMN[table];
  if (!bodyColumn || !isEnabled()) return;

  try {
    const { rows } = await pool.query(
      `SELECT title, ${bodyColumn} AS body, translations FROM ${table} WHERE id = $1`,
      [id],
    );
    if (!rows.length) return;

    const merged = await mergeTranslations(rows[0].translations, rows[0].title, rows[0].body);
    if (!merged) return;

    await pool.query(`UPDATE ${table} SET translations = $1 WHERE id = $2`, [JSON.stringify(merged), id]);
    console.log(`Translated ${table}#${id}: ${LANGUAGES.filter((l) => merged[l]).join(', ') || 'none'}`);
  } catch (error) {
    // Never surface as a save failure — the post itself is already stored.
    console.error(`Translating ${table}#${id} failed:`, error.message);
  }
}

/**
 * Translates anything that has no translation yet, in the background.
 *
 * Runs on boot so posts written before this feature existed — and any that
 * failed earlier — get picked up without anyone running a command. It is
 * naturally idempotent: rows that are already current are skipped, so after the
 * first pass this costs one query and nothing else.
 *
 * Paced to stay under the free tier's ~10 requests/minute.
 */
async function backfillMissing({ gapMs = 7000, limit = 200 } = {}) {
  if (!isEnabled()) return;

  for (const [table, bodyColumn] of Object.entries(BODY_COLUMN)) {
    let rows;
    try {
      ({ rows } = await pool.query(
        `SELECT id, title, ${bodyColumn} AS body, translations FROM ${table} ORDER BY id LIMIT $1`,
        [limit],
      ));
    } catch (error) {
      console.error(`Translation backfill could not read ${table}:`, error.message);
      continue;
    }

    const pending = rows.filter((row) => {
      const current = row.translations || {};
      return (
        current.sourceHash !== sourceHash(row.title, row.body) ||
        !LANGUAGES.every((l) => current[l])
      );
    });

    if (!pending.length) continue;
    console.log(`Translation backfill: ${pending.length} ${table} row(s) need translating.`);

    for (const row of pending) {
      await refreshTranslations(table, row.id);
      await new Promise((r) => setTimeout(r, gapMs));
    }
  }
  console.log('Translation backfill finished.');
}

/** Fire-and-forget wrapper, so an unhandled rejection can never crash the process. */
function scheduleTranslation(table, id) {
  setImmediate(() => {
    refreshTranslations(table, id).catch((e) => console.error('Translation scheduling error:', e.message));
  });
}

module.exports = {
  backfillMissing,
  translatePost,
  mergeTranslations,
  refreshTranslations,
  scheduleTranslation,
  sourceHash,
  isEnabled,
  LANGUAGES,
  LANGUAGE_NAMES,
  BODY_COLUMN,
};
