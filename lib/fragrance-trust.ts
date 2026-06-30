import type { Fragrance } from './fragrances';

export function sourceConfidenceLabel(fragrance: Fragrance) {
  if (fragrance.sourceQuality === 'official') return 'Official source';
  if (fragrance.sourceQuality === 'retailer') return 'Retailer-backed';
  if (fragrance.sourceQuality === 'community') return 'Community-backed';
  return 'Needs review';
}

export function sourceConfidenceTone(fragrance: Fragrance) {
  if (fragrance.sourceQuality === 'official') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (fragrance.sourceQuality === 'retailer') return 'border-blue-200 bg-blue-50 text-blue-800';
  if (fragrance.sourceQuality === 'community') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-stone-200 bg-stone-50 text-stone-600';
}

export function availabilityLabel(fragrance: Fragrance) {
  const labels: Record<Fragrance['availabilityStatus'], string> = {
    active: 'Active',
    discontinued: 'Discontinued',
    regional: 'Regional',
    limited: 'Limited',
    private_line: 'Private line',
    unknown: 'Availability needs review',
  };
  return labels[fragrance.availabilityStatus];
}

export function coverageLabel(fragrance: Fragrance) {
  const labels: Record<Fragrance['coverageStatus'], string> = {
    partial: 'Partial coverage',
    expanded: 'Expanded coverage',
    officially_verified: 'Officially verified',
    needs_review: 'Needs review',
  };
  return labels[fragrance.coverageStatus];
}

export function fragranceWarnings(fragrance: Fragrance) {
  const signals = [
    ...fragrance.notes,
    ...fragrance.accords,
    ...fragrance.vibeTags,
    ...fragrance.scentFamilies,
    ...fragrance.moods,
  ].map(signal => signal.toLowerCase());

  const includes = (terms: string[]) => terms.some(term => signals.some(signal => signal.includes(term)));
  const warnings: string[] = [];

  if (fragrance.projection === 'strong') warnings.push('Strong projection');
  if (includes(['oud'])) warnings.push('Contains oud');
  if (includes(['tobacco', 'smoky', 'smoke', 'leather'])) warnings.push('Smoky/leathery');
  if (includes(['vanilla', 'caramel', 'praline', 'sugar', 'honey']) && fragrance.scentFamilies.includes('sweet')) warnings.push('Very sweet');
  if (includes(['powdery', 'aldehydic', 'mature'])) warnings.push('May feel mature');
  if (fragrance.seasons.includes('winter') && !fragrance.seasons.includes('summer')) warnings.push('Better in cool weather');

  return [...new Set(warnings)].slice(0, 3);
}
