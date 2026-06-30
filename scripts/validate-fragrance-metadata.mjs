import { canonical, inferConcentration, loadCatalogEntries } from './fragrance-catalog-utils.mjs';

const entries = await loadCatalogEntries();
const errors = [];
const warnings = [];

const ids = new Map();
const canonicalNames = new Map();

for (const entry of entries) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
    errors.push(`${entry.id}: id should be kebab-case lowercase`);
  }

  if (!entry.brand || !entry.name) {
    errors.push(`${entry.id || '(missing id)'}: missing brand or name`);
  }

  if (!entry.hasNotesOrAccords) {
    errors.push(`${entry.id}: missing notes or accords`);
  }

  if (!entry.hasRecommendationTags) {
    errors.push(`${entry.id}: missing recommendation tags`);
  }

  if (!entry.hasImage) {
    errors.push(`${entry.id}: missing image field or image fallback path`);
  }

  const duplicateId = ids.get(entry.id);
  if (duplicateId) {
    errors.push(`${entry.id}: duplicate id in ${entry.sourceFile}; first seen in ${duplicateId.sourceFile}`);
  } else {
    ids.set(entry.id, entry);
  }

  const duplicateKey = [
    canonical(entry.brand),
    canonical(entry.name),
    entry.concentration || inferConcentration(entry.name),
  ].join('|');
  const duplicateName = canonicalNames.get(duplicateKey);
  if (duplicateName) {
    warnings.push(
      `${entry.brand} ${entry.name}: duplicate canonical brand/name/concentration with ${duplicateName.id} (${duplicateName.sourceFile})`,
    );
  } else {
    canonicalNames.set(duplicateKey, entry);
  }

  if (entry.sourceQuality === 'official' && !entry.productUrl) {
    errors.push(`${entry.id}: official-source entry is missing officialProductUrl/productUrl`);
  }

  if (entry.sourceQuality !== 'official') {
    warnings.push(`${entry.id}: source confidence is ${entry.sourceQuality}; needs official/retailer provenance follow-up`);
  }
}

const brandCount = new Set(entries.map(entry => canonical(entry.brand))).size;

if (warnings.length) {
  console.warn(`Fragrance metadata warnings (${warnings.length}):`);
  for (const warning of warnings.slice(0, 80)) console.warn(`- ${warning}`);
  if (warnings.length > 80) console.warn(`- ...and ${warnings.length - 80} more warnings`);
}

if (errors.length) {
  console.error(`Fragrance metadata validation failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Fragrance metadata valid: ${entries.length} entries across ${brandCount} brands.`);
