import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const workspace = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const dataFiles = [
  { key: 'core', label: 'Core database', file: path.join(workspace, 'lib', 'fragrances.ts') },
  { key: 'catalogExpansion', label: 'Catalog expansion', file: path.join(workspace, 'lib', 'fragrance-expansion.ts') },
  { key: 'brandExpansion', label: 'Brand expansion', file: path.join(workspace, 'lib', 'brand-expansion.ts') },
  { key: 'catalogCompletion', label: 'Catalog completion', file: path.join(workspace, 'lib', 'catalog-completion.ts') },
];

export const officialHostFragments = [
  'chanel.com',
  'dior.com',
  'yslbeauty',
  'tomfordbeauty',
  'maisonmargiela-fragrances',
  'franciskurkdjian',
  'zoologistperfumes',
  'initio-parfums',
  'louisvuitton.com',
  'goldfieldandbanks',
  'parfums-de-marly',
  'xerjoff.com',
  'diptyqueparis',
  'giorgioarmanibeauty',
  'armanibeauty',
  'lelabofragrances',
  'byredo.com',
  'creedfragrances',
  'jomalone',
  'prada-beauty',
  'valentino-beauty',
  'burberry.com',
];

export function canonical(value = '') {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function inferConcentration(name = '') {
  if (/\bextrait\b/i.test(name)) return 'extrait';
  if (/\belixir\b/i.test(name)) return 'elixir';
  if (/\beau de parfum\b|\bedp\b/i.test(name)) return 'eau de parfum';
  if (/\beau de toilette\b|\bedt\b/i.test(name)) return 'eau de toilette';
  if (/\bparfum\b/i.test(name)) return 'parfum';
  if (/\bcologne\b/i.test(name)) return 'cologne';
  return '';
}

export function sourceQualityFromUrl(url = '') {
  const normalized = url.toLowerCase();
  if (!normalized) return 'unknown';
  if (officialHostFragments.some(fragment => normalized.includes(fragment))) return 'official';
  if (
    normalized.includes('sephora')
    || normalized.includes('nordstrom')
    || normalized.includes('harrods')
    || normalized.includes('selfridges')
    || normalized.includes('neimanmarcus')
    || normalized.includes('saksfifthavenue')
    || normalized.includes('ulta.com')
  ) return 'retailer';
  if (normalized.includes('fragrantica') || normalized.includes('basenotes')) return 'community';
  return 'unknown';
}

function readStringArray(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, 'm'));
  if (!match) return [];
  return [...match[1].matchAll(/'([^']+)'/g)].map(item => item[1]);
}

function readString(block, key) {
  const match = block.match(new RegExp(`${key}:\\s*(?:'([^']*)'|"([^"]*)")`, 'm'));
  return match?.[1] ?? match?.[2] ?? '';
}

function objectEntries(source, fileMeta) {
  const entries = [];
  const matches = [...source.matchAll(/withProfile\(\{([\s\S]*?)\}\),?/g)];
  const coreMatches = fileMeta.key === 'core'
    ? [...source.matchAll(/^\s*\{\r?\n([\s\S]*?)^\s*\},/gm)]
    : [];

  for (const match of [...matches, ...coreMatches]) {
    const block = match[1];
    const id = readString(block, 'id');
    const name = readString(block, 'name');
    const brand = readString(block, 'brand');
    if (!id || !name || !brand) continue;

    const productUrl = readString(block, 'productUrl') || readString(block, 'sourceUrl');
    const notes = readStringArray(block, 'notes');
    const accords = readStringArray(block, 'accords');
    const vibeTags = readStringArray(block, 'vibeTags');
    const scentFamilies = readStringArray(block, 'scentFamilies');

    entries.push({
      id,
      name,
      brand,
      sourceKey: fileMeta.key,
      sourceLabel: fileMeta.label,
      sourceFile: path.relative(workspace, fileMeta.file),
      concentration: inferConcentration(name),
      productUrl,
      sourceQuality: sourceQualityFromUrl(productUrl),
      hasImage: /imageUrl:\s*'[^']+'/m.test(block) || true,
      hasNotesOrAccords: notes.length > 0 || accords.length > 0,
      hasRecommendationTags: scentFamilies.length > 0 && (vibeTags.length > 0 || accords.length > 0 || notes.length > 0),
    });
  }
  return entries;
}

function brandExpansionEntries(source, fileMeta) {
  const entries = [];
  const calls = [...source.matchAll(/expandBrand\(\s*\{\s*brand:\s*'([^']+)'[\s\S]*?\},\s*\[([\s\S]*?)\]\s*,\s*\)/g)];

  for (const call of calls) {
    const brand = call[1];
    const body = call[2];
    const entryMatches = [...body.matchAll(/^\s{4}\[\r?\n\s{6}'([^']+)',\r?\n\s{6}(?:'([^']+)'|"([^"]+)"),\r?\n\s{6}'[^']+',/gm)];
    for (const match of entryMatches) {
      entries.push({
        id: match[1],
        name: match[2] ?? match[3],
        brand,
        sourceKey: fileMeta.key,
        sourceLabel: fileMeta.label,
        sourceFile: path.relative(workspace, fileMeta.file),
        concentration: inferConcentration(match[2]),
        productUrl: '',
        sourceQuality: 'unknown',
        hasImage: true,
        hasNotesOrAccords: true,
        hasRecommendationTags: true,
      });
    }
  }
  return entries;
}

function catalogCompletionEntries(source, fileMeta) {
  const defaults = new Map(
    [...source.matchAll(/^\s{2}('?[^:\n]+?'?):\s*\{[\s\S]*?productUrl:\s*'([^']+)'/gm)]
      .map(match => [match[1].replaceAll("'", '').trim(), match[2]]),
  );
  const entries = [];
  const matches = [...source.matchAll(/^\s+\['([^']+)',\s+'([^']+)',\s+(?:'([^']+)'|"([^"]+)"),/gm)];

  for (const match of matches) {
    const brand = match[1];
    const productUrl = defaults.get(brand) ?? '';
    entries.push({
      id: match[2],
      name: match[3] ?? match[4],
      brand,
      sourceKey: fileMeta.key,
      sourceLabel: fileMeta.label,
      sourceFile: path.relative(workspace, fileMeta.file),
      concentration: inferConcentration(match[3]),
      productUrl,
      sourceQuality: sourceQualityFromUrl(productUrl),
      hasImage: true,
      hasNotesOrAccords: true,
      hasRecommendationTags: true,
    });
  }
  return entries;
}

export async function loadCatalogEntries() {
  const entries = [];
  for (const fileMeta of dataFiles) {
    const source = await fs.readFile(fileMeta.file, 'utf8');
    if (fileMeta.key === 'brandExpansion') {
      entries.push(...brandExpansionEntries(source, fileMeta));
      continue;
    }
    if (fileMeta.key === 'catalogCompletion') {
      entries.push(...catalogCompletionEntries(source, fileMeta));
      continue;
    }
    entries.push(...objectEntries(source, fileMeta));
  }
  return entries;
}

export async function loadOfficialCatalogUrls() {
  const completion = await fs.readFile(path.join(workspace, 'lib', 'catalog-completion.ts'), 'utf8');
  return new Map(
    [...completion.matchAll(/^\s{2}('?[^:\n]+?'?):\s*\{[\s\S]*?productUrl:\s*'([^']+)'/gm)]
      .map(match => [match[1].replaceAll("'", '').trim(), match[2]]),
  );
}
