import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.dirname(scriptDirectory);
const productDirectory = path.join(workspace, 'public', 'images', 'products');
const sourceFiles = [
  path.join(workspace, 'lib', 'fragrances.ts'),
  path.join(workspace, 'lib', 'fragrance-expansion.ts'),
  path.join(workspace, 'lib', 'brand-expansion.ts'),
];

const ids = [];
for (const file of sourceFiles) {
  const source = await fs.readFile(file, 'utf8');
  ids.push(...[...source.matchAll(/^\s+id: '([^']+)',?$/gm)].map(match => match[1]));
  ids.push(...[...source.matchAll(
    /^\s+\[\r?\n\s+'([^']+)',\r?\n\s+(?:'[^']+'|"[^"]+"),\r?\n\s+'[^']+',/gm,
  )].map(match => match[1]));
}

const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) {
  throw new Error(`Duplicate fragrance IDs: ${[...new Set(duplicates)].join(', ')}`);
}

const manifest = JSON.parse(
  await fs.readFile(path.join(productDirectory, 'sources.json'), 'utf8'),
);
const sourceById = new Map(manifest.map(source => [source.id, source]));
const failures = [];
const minimumProductImageSize = 480;

for (const id of ids) {
  const source = sourceById.get(id);
  if (!source || source.status !== 'OK' || !source.file || !source.pageUrl) {
    failures.push(`${id}: missing successful image source`);
    continue;
  }

  const filePath = path.join(productDirectory, source.file);
  try {
    const metadata = await sharp(filePath).metadata();
    if (
      !metadata.width
      || !metadata.height
      || metadata.width < minimumProductImageSize
      || metadata.height < minimumProductImageSize
    ) {
      failures.push(
        `${id}: expected product image at least ${minimumProductImageSize}px on each side, received ${metadata.width}x${metadata.height}`,
      );
    }
  } catch {
    failures.push(`${id}: product image file is missing or unreadable`);
  }
}

const orphanedSources = manifest
  .filter(source => !ids.includes(source.id))
  .map(source => source.id);
if (orphanedSources.length) {
  failures.push(`orphaned manifest entries: ${orphanedSources.join(', ')}`);
}

if (failures.length) {
  throw new Error(`Catalog validation failed:\n${failures.join('\n')}`);
}

const expansionCount = ids.length - (
  (
    await fs.readFile(path.join(workspace, 'lib', 'fragrances.ts'), 'utf8')
  ).match(/^\s+id: '([^']+)',?$/gm)?.length ?? 0
);

console.log(`Catalog valid: ${ids.length} fragrances, ${expansionCount} expansion entries, ${manifest.length} sourced images.`);
