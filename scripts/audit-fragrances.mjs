import fs from 'node:fs/promises';
import path from 'node:path';
import {
  canonical,
  loadCatalogEntries,
  loadOfficialCatalogUrls,
  workspace,
} from './fragrance-catalog-utils.mjs';

const entries = await loadCatalogEntries();
const officialCatalogUrls = await loadOfficialCatalogUrls();
const reportDirectory = path.join(workspace, 'docs');
const reportJsonPath = path.join(reportDirectory, 'fragrance-audit-report.json');
const reportMarkdownPath = path.join(reportDirectory, 'fragrance-catalog-audit.md');
const lastChecked = '2026-06-30';

await fs.mkdir(reportDirectory, { recursive: true });

const byBrand = new Map();
for (const entry of entries) {
  const key = canonical(entry.brand);
  if (!byBrand.has(key)) {
    byBrand.set(key, {
      brand: entry.brand,
      entries: [],
    });
  }
  byBrand.get(key).entries.push(entry);
}

const brandReports = [...byBrand.values()]
  .sort((a, b) => a.brand.localeCompare(b.brand))
  .map(({ brand, entries: brandEntries }) => {
    const addedCount = brandEntries.filter(entry => entry.sourceKey === 'catalogCompletion').length;
    const officialCount = brandEntries.filter(entry => entry.sourceQuality === 'official').length;
    const retailerCount = brandEntries.filter(entry => entry.sourceQuality === 'retailer').length;
    const communityCount = brandEntries.filter(entry => entry.sourceQuality === 'community').length;
    const needsReviewCount = brandEntries.length - officialCount - retailerCount - communityCount;
    const officialUrl = officialCatalogUrls.get(brand);
    const coverageStatus = officialUrl && addedCount > 0
      ? 'expanded'
      : officialCount > 0
        ? 'partial'
        : 'needs_review';

    return {
      brand,
      existingSiteCount: brandEntries.length,
      auditedOfficialCount: officialCount,
      missingCandidateCount: null,
      addedCount,
      needsReviewCount,
      coverageStatus,
      sourceQuality: officialCount > 0 ? 'official' : retailerCount > 0 ? 'retailer' : communityCount > 0 ? 'community' : 'unknown',
      officialCatalogUrls: officialUrl ? [officialUrl] : [],
      retailerUrls: [],
      communityUrls: [],
      lastChecked,
      notes: coverageStatus === 'expanded'
        ? 'Expanded against an official brand collection-level URL. Exact product-page verification remains follow-up work before marking officially_verified.'
        : coverageStatus === 'partial'
          ? 'At least one official/retailer-backed product source exists, but full active catalog verification is incomplete.'
          : 'Legacy database coverage; needs official catalog follow-up before trust status can be promoted.',
      fragranceIds: brandEntries.map(entry => entry.id).sort(),
    };
  });

const sourceCounts = entries.reduce((acc, entry) => {
  acc[entry.sourceKey] = (acc[entry.sourceKey] ?? 0) + 1;
  return acc;
}, {});

const coverageCounts = brandReports.reduce((acc, item) => {
  acc[item.coverageStatus] = (acc[item.coverageStatus] ?? 0) + 1;
  return acc;
}, {});

const report = {
  generatedAt: new Date().toISOString(),
  lastChecked,
  sourceHierarchy: [
    'Official brand collection pages',
    'Official brand product pages',
    'Official brand press/archive pages',
    'Authorized retailers',
    'Community databases for secondary metadata only',
  ],
  totals: {
    brands: brandReports.length,
    fragrances: entries.length,
    preCompletionFragrances: entries.length - (sourceCounts.catalogCompletion ?? 0),
    completionEntries: sourceCounts.catalogCompletion ?? 0,
    sourceFiles: sourceCounts,
    coverageStatuses: coverageCounts,
  },
  brands: brandReports,
};

await fs.writeFile(reportJsonPath, `${JSON.stringify(report, null, 2)}\n`);

const markdownRows = brandReports.map(item => (
  `| ${item.brand} | ${item.existingSiteCount} | ${item.addedCount} | ${item.auditedOfficialCount} | ${item.needsReviewCount} | ${item.coverageStatus} | ${item.officialCatalogUrls.length ? item.officialCatalogUrls.join('<br>') : 'Needs official URL'} |`
));

const markdown = `# ScentMatch Fragrance Catalog Audit

Generated: ${report.generatedAt}  
Last checked: ${lastChecked}

This report tracks source confidence for the fragrance database. It is intentionally transparent: brands are marked \`expanded\`, \`partial\`, or \`needs_review\` unless a full official catalog verification has been completed.

## Source Hierarchy

1. Official brand collection pages
2. Official brand product pages
3. Official brand press/archive pages
4. Authorized retailers such as Sephora, Nordstrom, iShopChangi, and department stores
5. Community databases only for secondary metadata when official/retailer data is missing

## Totals

- Brands: ${report.totals.brands}
- Fragrances: ${report.totals.fragrances}
- Fragrances before completion expansion: ${report.totals.preCompletionFragrances}
- Completion expansion entries: ${report.totals.completionEntries}
- Coverage statuses: ${Object.entries(report.totals.coverageStatuses).map(([key, value]) => `${key}: ${value}`).join(', ')}

## Brand Coverage

| Brand | Site count | Added in completion | Official-backed count | Needs review count | Coverage | Official catalog URL |
| --- | ---: | ---: | ---: | ---: | --- | --- |
${markdownRows.join('\n')}

## Notes

- \`expanded\` means ScentMatch now includes many important missing fragrances from an official collection-level URL, but individual product pages still need final verification.
- \`partial\` means some product-level or official/retailer-backed data exists, but the brand has not been fully reconciled against an active official catalog.
- \`needs_review\` means the legacy entry is useful for recommendations but needs official source/provenance follow-up.
- The project should not claim 100% global catalog coverage until every active official fragrance in scope is reconciled and deliberately included/excluded.
`;

await fs.writeFile(reportMarkdownPath, markdown);

console.log(`Audit written: ${path.relative(workspace, reportMarkdownPath)}`);
console.log(`Audit JSON written: ${path.relative(workspace, reportJsonPath)}`);
console.log(`${report.totals.fragrances} fragrances across ${report.totals.brands} brands.`);
