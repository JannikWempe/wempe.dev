#!/usr/bin/env npx tsx

const SITEMAP_INDEX_URL = 'https://wempe.dev/sitemap-index.xml';
const INDEXNOW_KEY = '0e7f324c13ef4fc8b499316ad33afb98';
const HOST = 'wempe.dev';

async function fetchXml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return res.text();
}

function extractUrls(xml: string, tag: string): string[] {
  const regex = new RegExp(`<${tag}>\\s*<loc>([^<]+)</loc>`, 'g');
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(xml)) !== null) {
    urls.push(match[1].trim());
  }
  return urls;
}

async function submitToIndexNow(urls: string[]): Promise<void> {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`Submitted ${urls.length} URLs`);
  } else {
    const text = await res.text();
    throw new Error(`IndexNow submission failed: ${res.status} ${text}`);
  }
}

async function main() {
  console.log('Fetching sitemap index...');
  const indexXml = await fetchXml(SITEMAP_INDEX_URL);
  const sitemapUrls = extractUrls(indexXml, 'sitemap');
  console.log(`Found ${sitemapUrls.length} sitemap(s)`);

  const allUrls: string[] = [];
  for (const sitemapUrl of sitemapUrls) {
    console.log(`Fetching ${sitemapUrl}...`);
    const sitemapXml = await fetchXml(sitemapUrl);
    const urls = extractUrls(sitemapXml, 'url');
    allUrls.push(...urls);
  }

  console.log(`Total URLs: ${allUrls.length}`);

  if (allUrls.length === 0) {
    console.log('No URLs to submit');
    return;
  }

  console.log('Submitting to IndexNow...');
  await submitToIndexNow(allUrls);
  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
