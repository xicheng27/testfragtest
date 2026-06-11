import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const workspace = path.dirname(scriptDirectory);
const powershellScript = path.join(scriptDirectory, 'fetch-product-images.ps1');
const outputDirectory = path.join(workspace, 'public', 'images', 'products');
const manifestPath = path.join(outputDirectory, 'sources.json');
const concurrency = 6;
const manualOverrides = {
  'billie-eilish-eilish': {
    pageUrl: 'https://www.ulta.com/p/eilish-eau-de-parfum-pimprod2030620',
    imageUrl: 'https://media.ulta.com/i/ulta/2594570?w=1080&h=1080&fmt=auto',
  },
  'narciso-rodriguez-for-her': {
    pageUrl: 'https://www.narcisorodriguezparfums.com/en/narciso-rodriguez-for-her/for-her-edt.html',
    imageUrl: 'https://www.narcisorodriguezparfums.com/dw/image/v2/BCMQ_PRD/on/demandware.static/-/Sites-itemmaster_narcisorodriguez/default/dw9b9df683/for-her-edt/narciso-rodriguez-for-her-eau-de-toilette-perfume-100ml.png?sw=800&sh=900&sm=fit&q=100',
  },
  'terre-hermes': {
    pageUrl: 'https://www.hermes.com/es/es/product/terre-d-hermes-eau-de-toilette-V107188V0/',
    imageUrl: 'https://www.sephora.com.br/dw/image/v2/BFJC_PRD/on/demandware.static/-/Sites-masterCatalog_Sephora/pt_BR/dw5b0bf162/images/hi-res-BR/3346131400003_1500px.jpg?sw=1200&sh=1200&sm=fit',
  },
  'boss-bottled': {
    pageUrl: 'https://www.sephora.it/p/boss-bottled---eau-de-toilette-794299.html',
    imageUrl: 'https://media.sephora.eu/content/dam/digital/pim/published/H/HUGO_BOSS/P2384/18656-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit',
  },
  'lattafa-yara': {
    pageUrl: 'https://beautyhouse.com/products/lattafa-yara-eau-de-parfum-for-women',
    imageUrl: 'https://beautyhouse.com/cdn/shop/files/01jokedobc_8189428f-39e0-4267-ac2c-759892ceff6a.png?v=1759859282&width=1600',
  },
  'ysl-black-opium': {
    pageUrl: 'https://www.sephora.it/p/black-opium---eau-de-parfum-306748.html',
    imageUrl: 'https://media.sephora.eu/content/dam/digital/pim/published/Y/YVES_SAINT_LAURENT/P1920022/23512-media_1.jpg?scaleWidth=750&scaleHeight=750&scaleMode=fit',
  },
  'prada-paradoxe': {
    pageUrl: 'https://www.prada.com/us/en/p/paradoxe-edp-90-ml/1A1351_2HDZ_F0Z99_P_ML090',
    imageUrl: 'https://www.prada.com/content/dam/pradabkg_products/1/1A1/1A1351/2HDZF0Z99/1A1351_2HDZ_F0Z99_P_ML090_SLF.jpg',
  },
  'zoologist-panda': {
    pageUrl: 'https://www.zoologistperfumes.com/products/panda',
    imageUrl: 'https://www.zoologistperfumes.com/cdn/shop/files/Bottle-Front-Panda_600x.jpg?v=1772388281',
  },
  'replica-on-a-date': {
    pageUrl: 'https://www.maisonmargiela-fragrances.eu/en_GB/fragrances/discover/replica-memories/replica-on-a-date/MM016.html',
    imageUrl: 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwcfcb439e/images/products/MM016/MM016_MAIN.jpg',
  },
  'mfk-a-la-rose': {
    pageUrl: 'https://www.franciskurkdjian.com/us-en/p/a-la-rose-eau-de-parfum-RA12241.html',
    imageUrl: 'https://www.franciskurkdjian.com/dw/image/v2/BJSB_PRD/on/demandware.static/-/Sites-mfk-master-catalog/default/dw2ddda9d3/A_LA_ROSE/FRAGRANCE/3700559612255_A_LA_ROSE_EDP_70ML_1.png?sw=1600&sh=1600&sfrm=png&q=85&strip=true',
  },
  'replica-dancing-on-the-moon': {
    pageUrl: 'https://www.maisonmargiela-fragrances.eu/en_GB/replica-dancing-on-the-moon/MM153.html',
    imageUrl: 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwb2bea881/images/products/MM153/1_2000x2000.jpg',
  },
  'replica-ideal-one': {
    pageUrl: 'https://www.maisonmargiela-fragrances.eu/en_GB/fragrances/discover/replica-memories/replica-ideal-one/MM164.html',
    imageUrl: 'https://www.maisonmargiela-fragrances.eu/dw/image/v2/BDCR_PRD/on/demandware.static/-/Sites-margiela-master-catalog/default/dwb5a2544d/images/products/MM164/1.jpg',
  },
};

const trustedRetailers = [
  'sephora.com', 'sephora.com.au', 'sephora.co.uk', 'sephora.fr', 'sephora.it',
  'sephora.pt', 'ulta.com', 'nordstrom.com', 'macys.com', 'bloomingdales.com',
  'fragrancenet.com', 'fragrancex.com', 'saksfifthavenue.com',
  'neimanmarcus.com', 'harrods.com', 'selfridges.com',
  'fragrantica.com', 'parfumo.com',
];

const source = await fs.readFile(powershellScript, 'utf8');
const itemPattern = /@\{\s*id = '([^']+)';\s*query = '([^']+)';\s*domain = '([^']+)'\s*\}/g;
const items = [...source.matchAll(itemPattern)].map(([, id, query, domain]) => ({
  id,
  query,
  domain,
}));

const existing = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
const manifest = new Map(existing.map(item => [item.id, item]));
const pending = [];
const forcedIds = new Set(process.argv.slice(2));

for (const item of items) {
  const current = manifest.get(item.id);
  const imagePath = current?.file ? path.join(outputDirectory, current.file) : '';
  const imageExists = imagePath && await fs.stat(imagePath).then(() => true, () => false);
  if (forcedIds.has(item.id) || !current || current.status !== 'OK' || !imageExists) pending.push(item);
}

function trusted(url, domains) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return domains.some(domain => host === domain || host.endsWith(`.${domain}`));
  } catch {
    return false;
  }
}

async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'user-agent': 'Mozilla/5.0',
        ...options.headers,
      },
    });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function imageCandidates(query) {
  const encoded = encodeURIComponent(query);
  const search = await fetchWithTimeout(`https://duckduckgo.com/?q=${encoded}`);
  const html = await search.text();
  const token = html.match(/vqd=["']?([\d-]+)/)?.[1];
  if (!token) return [];

  const response = await fetchWithTimeout(
    `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encoded}&vqd=${token}&f=,,,,,&p=1`,
    { headers: { referer: 'https://duckduckgo.com/' } },
  );
  const json = await response.json();
  return (json.results ?? []).map(result => ({
    pageUrl: result.url,
    imageUrl: result.image,
    thumbnailUrl: result.thumbnail,
  }));
}

async function findCandidate(item) {
  const domains = [item.domain, ...trustedRetailers];
  if (manualOverrides[item.id]) {
    return {
      candidate: {
        ...manualOverrides[item.id],
        thumbnailUrl: '',
        manual: true,
      },
      domains,
    };
  }
  for (const suffix of ['official product bottle white background', 'Sephora product bottle']) {
    try {
      const candidates = await imageCandidates(`${item.query} ${suffix}`);
      const candidate = candidates.find(result => (
        trusted(result.pageUrl, domains) || trusted(result.imageUrl, domains)
      ));
      if (candidate) return { candidate, domains };
    } catch {
      // A second focused query is attempted below.
    }
  }
  return { candidate: null, domains };
}

async function downloadImage(candidate) {
  for (const url of [candidate.imageUrl, candidate.thumbnailUrl]) {
    if (!url) continue;
    try {
      const response = await fetchWithTimeout(url, {
        headers: { referer: candidate.pageUrl },
      });
      const buffer = Buffer.from(await response.arrayBuffer());
      if (buffer.length >= 5000) return { buffer, sourceUrl: url };
    } catch {
      // Fall through to the thumbnail.
    }
  }
  throw new Error('No downloadable product image.');
}

async function writeManifest() {
  const ordered = items
    .map(item => manifest.get(item.id))
    .filter(Boolean);
  await fs.writeFile(manifestPath, `${JSON.stringify(ordered, null, 2)}\n`, 'utf8');
}

async function processItem(item) {
  const { candidate, domains } = await findCandidate(item);
  if (!candidate) {
    manifest.set(item.id, {
      id: item.id,
      status: 'NO_TRUSTED_RESULT',
      pageUrl: '',
      imageSourceUrl: '',
      file: '',
    });
    await writeManifest();
    console.log(`${item.id}: no trusted result`);
    return;
  }

  try {
    const { buffer, sourceUrl } = await downloadImage(candidate);
    const file = `${item.id}.jpg`;
    await sharp(buffer)
      .resize(900, 900, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toFile(path.join(outputDirectory, file));

    const pageUrl = candidate.manual || trusted(candidate.pageUrl, domains)
      ? candidate.pageUrl
      : `https://${new URL(candidate.imageUrl).hostname}/`;
    manifest.set(item.id, {
      id: item.id,
      status: 'OK',
      pageUrl,
      imageSourceUrl: sourceUrl,
      file,
    });
    console.log(`${item.id}: OK`);
  } catch (error) {
    manifest.set(item.id, {
      id: item.id,
      status: `FAILED: ${error.message}`,
      pageUrl: candidate.pageUrl,
      imageSourceUrl: candidate.imageUrl,
      file: '',
    });
    console.log(`${item.id}: failed`);
  }
  await writeManifest();
}

let cursor = 0;
async function worker() {
  while (cursor < pending.length) {
    const item = pending[cursor];
    cursor += 1;
    await processItem(item);
  }
}

await fs.mkdir(outputDirectory, { recursive: true });
console.log(`Fetching ${pending.length} missing product images with concurrency ${concurrency}.`);
await Promise.all(Array.from({ length: concurrency }, () => worker()));
await writeManifest();

const results = [...manifest.values()];
const ok = results.filter(result => result.status === 'OK').length;
console.log(`Completed: ${ok}/${items.length} product images ready.`);
