/**
 * Regenerates the self-hosted webfonts in src/styles/.
 *
 * Run with: node scripts/fetch-fonts.mjs
 *
 * Why self-hosted: loading these from fonts.gstatic.com disclosed every
 * visitor's IP address to Google, and cost an extra DNS lookup plus TLS
 * handshake before the first paint.
 *
 * Both families are VARIABLE fonts, so Google serves one file per subset that
 * covers the whole weight range and repeats it in a @font-face per weight. We
 * collapse those into one rule per file with a weight range, which is both
 * smaller CSS and truer rendering: intermediate weights come from the variable
 * axis instead of being synthesised.
 *
 * Google's unicode-range subsetting is kept intact, so a Kurdish or Arabic
 * reader downloads only the arabic subset and a Latin reader only latin.
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve('src/styles/fonts');
const CSS_OUT = path.resolve('src/styles/fonts.css');

// Weight 800 is deliberately absent: nothing in the codebase uses font-extrabold.
const SRC_URL =
  'https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&family=Sora:wght@600;700&display=swap';

// A modern Chrome UA makes Google serve woff2 with unicode-range subsets.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const css = await (await fetch(SRC_URL, { headers: { 'User-Agent': UA } })).text();

// Each rule is preceded by a /* subset */ comment naming its unicode range.
const RULE = /\/\*\s*([\w-]+)\s*\*\/\s*@font-face\s*\{([^}]+)\}/g;
const field = (body, name) => body.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1]?.trim();

/** key: family + remote file -> one emitted @font-face */
const faces = new Map();

for (const [, subset, body] of css.matchAll(RULE)) {
  const family = field(body, 'font-family')?.replace(/'/g, '');
  const url = field(body, 'src')?.match(/url\(([^)]+)\)/)?.[1];
  const weight = Number(field(body, 'font-weight'));
  const range = field(body, 'unicode-range');
  if (!family || !url) continue;

  const key = `${family}|${url}`;
  const face = faces.get(key) ?? {
    family,
    url,
    subset,
    range,
    style: field(body, 'font-style') || 'normal',
    weights: [],
    file: `${family.toLowerCase().replace(/\s+/g, '-')}-${subset}.woff2`,
  };
  face.weights.push(weight);
  faces.set(key, face);
}

fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let out = `/*
 * Self-hosted webfonts — GENERATED, do not edit by hand.
 * Regenerate with: node scripts/fetch-fonts.mjs
 *
 * Served from our own origin so that no visitor IP address reaches Google.
 * Vite hashes these files into /assets, where server.mjs serves them immutable
 * for a year.
 */
`;

let total = 0;
for (const face of faces.values()) {
  const bytes = Buffer.from(await (await fetch(face.url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  fs.writeFileSync(path.join(OUT_DIR, face.file), bytes);
  total += bytes.length;
  console.log(`  ${face.file.padEnd(30)} ${String(bytes.length / 1024 | 0).padStart(4)} KB  weights ${Math.min(...face.weights)}-${Math.max(...face.weights)}`);

  const lo = Math.min(...face.weights);
  const hi = Math.max(...face.weights);
  out += `\n@font-face {
  font-family: '${face.family}';
  font-style: ${face.style};
  font-weight: ${lo === hi ? lo : `${lo} ${hi}`};
  font-display: swap;
  src: url('./fonts/${face.file}') format('woff2');
  unicode-range: ${face.range};
}\n`;
}

fs.writeFileSync(CSS_OUT, out);
console.log(`\n${faces.size} files, ${(total / 1024).toFixed(1)} KB total`);
