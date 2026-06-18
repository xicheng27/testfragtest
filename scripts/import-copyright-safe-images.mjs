import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.dirname(scriptDirectory);
const productDirectory = path.join(workspace, 'public', 'images', 'products');
const manifestPath = path.join(productDirectory, 'sources.json');
const csvPath = process.argv[2];

if (!csvPath) {
  throw new Error('Usage: node scripts/import-copyright-safe-images.mjs <csv-path>');
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (character === '"') {
      if (quoted && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ',' && !quoted) {
      row.push(field);
      field = '';
    } else if ((character === '\n' || character === '\r') && !quoted) {
      if (character === '\r' && source[index + 1] === '\n') index += 1;
      row.push(field);
      field = '';
      if (row.some(value => value.length > 0)) rows.push(row);
      row = [];
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...values] = rows;
  return values.map(columns => Object.fromEntries(
    headers.map((header, index) => [header.replace(/^\uFEFF/, ''), columns[index] ?? '']),
  ));
}

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function repairText(value) {
  if (!/[ÂÃ]/.test(value)) return value;
  return Buffer.from(value, 'latin1').toString('utf8');
}

function hashString(value) {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function queryFromUrl(url) {
  try {
    const slug = new URL(url).pathname.split('/').filter(Boolean).at(-1) ?? '';
    return decodeURIComponent(slug).replaceAll('-', ' ').trim();
  } catch {
    return '';
  }
}

const palettes = {
  aquatic: ['#dce9e7', '#89aeb0', '#315f68', '#f6f4ec'],
  floral: ['#f1dfdf', '#c58f9c', '#765163', '#faf5ef'],
  gourmand: ['#eadcc7', '#c59366', '#6c4635', '#fbf4e7'],
  woody: ['#d8d0c2', '#927967', '#3f3935', '#f1eee7'],
  green: ['#dce3d5', '#8b9d7a', '#485744', '#f4f1e7'],
  citrus: ['#eee4bd', '#d0a94f', '#71602f', '#faf4dc'],
  dark: ['#d6cbd3', '#756473', '#2f2930', '#eee9e6'],
  neutral: ['#e7dfd5', '#aa9685', '#564b45', '#f8f4ed'],
};

function paletteFor(query) {
  const normalized = query.toLowerCase();
  if (/(sea|ocean|marine|aquatic|water|rain|blue)/.test(normalized)) return palettes.aquatic;
  if (/(rose|floral|flower|jasmine|pink|peony|violet)/.test(normalized)) return palettes.floral;
  if (/(vanilla|sweet|coffee|caramel|chocolate|marshmallow|almond|honey)/.test(normalized)) return palettes.gourmand;
  if (/(wood|oud|tobacco|leather|smoky|cedar|sandalwood|vetiver)/.test(normalized)) return palettes.woody;
  if (/(green|fig|herbal|grass|forest|moss)/.test(normalized)) return palettes.green;
  if (/(citrus|lemon|orange|bergamot|grapefruit|pineapple|peach)/.test(normalized)) return palettes.citrus;
  if (/(dark|black|night|amber|spice|cherry|red)/.test(normalized)) return palettes.dark;
  return palettes.neutral;
}

function wrapLabel(value, maxLength = 21) {
  const words = value.trim().split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxLength && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

function createArtwork(row) {
  const id = row.id;
  const name = repairText(row.name);
  const brand = repairText(row.brand);
  const query = queryFromUrl(row.unsplash_generic_url);
  const terms = query.split(/\s+/).filter(Boolean).slice(0, 3);
  const [background, accent, ink, paper] = paletteFor(query);
  const hash = hashString(`${id}:${query}`);
  const bottleWidth = 250 + (hash % 90);
  const bottleHeight = 360 + ((hash >>> 5) % 100);
  const bottleX = 450 - bottleWidth / 2;
  const bottleY = 246 + ((hash >>> 9) % 35);
  const capWidth = Math.round(bottleWidth * (0.28 + ((hash >>> 13) % 10) / 100));
  const capHeight = 54 + ((hash >>> 17) % 38);
  const capX = 450 - capWidth / 2;
  const nameLines = wrapLabel(name);
  const nameMarkup = nameLines.map((line, index) => (
    `<tspan x="450" dy="${index === 0 ? 0 : 38}">${escapeXml(line)}</tspan>`
  )).join('');
  const termMarkup = terms.map((term, index) => (
    `<text x="${110 + index * 225}" y="805" fill="${ink}" opacity="0.68" font-size="17" letter-spacing="2.4">${escapeXml(term.toUpperCase())}</text>`
  )).join('');
  const orbOneX = 130 + (hash % 150);
  const orbOneY = 140 + ((hash >>> 4) % 100);
  const orbTwoX = 680 + ((hash >>> 8) % 100);
  const orbTwoY = 250 + ((hash >>> 12) % 160);

  return Buffer.from(`
    <svg width="900" height="900" viewBox="0 0 900 900" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${paper}"/>
          <stop offset="0.58" stop-color="${background}"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0.72"/>
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="0.8" y2="1">
          <stop offset="0" stop-color="#ffffff" stop-opacity="0.84"/>
          <stop offset="0.5" stop-color="${background}" stop-opacity="0.52"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0.72"/>
        </linearGradient>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="3" seed="${hash % 97}"/>
          <feColorMatrix type="saturate" values="0"/>
          <feComponentTransfer><feFuncA type="table" tableValues="0 0.075"/></feComponentTransfer>
        </filter>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="28" stdDeviation="25" flood-color="${ink}" flood-opacity="0.2"/>
        </filter>
      </defs>

      <rect width="900" height="900" fill="url(#bg)"/>
      <circle cx="${orbOneX}" cy="${orbOneY}" r="170" fill="${accent}" opacity="0.18"/>
      <circle cx="${orbTwoX}" cy="${orbTwoY}" r="205" fill="${paper}" opacity="0.56"/>
      <path d="M0 650 C190 570 315 715 510 630 C665 564 760 595 900 520 L900 900 L0 900 Z" fill="${paper}" opacity="0.62"/>
      <rect width="900" height="900" filter="url(#grain)" opacity="0.72"/>

      <text x="72" y="84" fill="${ink}" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="4">SCENT STUDY</text>
      <text x="828" y="84" fill="${ink}" opacity="0.55" text-anchor="end" font-family="Arial, sans-serif" font-size="15" letter-spacing="2">${escapeXml(brand.toUpperCase())}</text>

      <g filter="url(#shadow)">
        <rect x="${capX}" y="${bottleY - capHeight + 10}" width="${capWidth}" height="${capHeight}" rx="${Math.min(24, capHeight / 3)}" fill="${ink}" opacity="0.84"/>
        <rect x="${bottleX}" y="${bottleY}" width="${bottleWidth}" height="${bottleHeight}" rx="${36 + (hash % 30)}" fill="url(#glass)" stroke="#ffffff" stroke-opacity="0.78" stroke-width="4"/>
        <path d="M${bottleX + 30} ${bottleY + 34} H${bottleX + bottleWidth - 30}" stroke="#ffffff" stroke-width="3" opacity="0.58"/>
        <rect x="${bottleX + 35}" y="${bottleY + bottleHeight * 0.47}" width="${bottleWidth - 70}" height="${bottleHeight * 0.28}" rx="8" fill="${paper}" opacity="0.88"/>
        <text x="450" y="${bottleY + bottleHeight * 0.57}" fill="${ink}" text-anchor="middle" font-family="Georgia, serif" font-size="${name.length > 22 ? 27 : 32}" font-weight="700">${nameMarkup}</text>
      </g>

      <line x1="72" y1="758" x2="828" y2="758" stroke="${ink}" opacity="0.2"/>
      ${termMarkup}
      <text x="828" y="850" fill="${ink}" opacity="0.5" text-anchor="end" font-family="Arial, sans-serif" font-size="14" letter-spacing="2">ORIGINAL EDITORIAL ARTWORK</text>
    </svg>
  `);
}

const csv = await fs.readFile(path.resolve(csvPath), 'utf8');
const rows = parseCsv(csv);
const rowsById = new Map();
for (const row of rows) {
  if (row.id) rowsById.set(row.id, row);
}

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const manifestIds = new Set(manifest.map(source => source.id));
const missingRows = [...manifestIds].filter(id => !rowsById.has(id));
const unknownRows = [...rowsById.keys()].filter(id => !manifestIds.has(id));

if (missingRows.length || unknownRows.length) {
  throw new Error([
    missingRows.length ? `Missing CSV rows: ${missingRows.join(', ')}` : '',
    unknownRows.length ? `Unknown CSV rows: ${unknownRows.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
}

const updatedManifest = [];
for (const source of manifest) {
  const row = rowsById.get(source.id);
  const artwork = createArtwork(row);
  const filePath = path.join(productDirectory, source.file);
  await sharp(artwork)
    .resize(900, 900, { fit: 'cover' })
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
    .toFile(`${filePath}.next`);
  await fs.rm(filePath);
  await fs.rename(`${filePath}.next`, filePath);

  updatedManifest.push({
    ...source,
    status: 'OK',
    imageSourceUrl: 'original-editorial-artwork',
    copyrightSafeReferenceUrl: row.unsplash_generic_url,
    brandPressPage: row.brand_press_page,
    sourceNotes: row.notes,
    imageKind: 'editorial-scent-study',
  });
}

await fs.writeFile(manifestPath, `${JSON.stringify(updatedManifest, null, 2)}\n`);

console.log(
  `Generated ${updatedManifest.length} copyright-safe editorial images from ${rowsById.size} unique CSV rows.`,
);
