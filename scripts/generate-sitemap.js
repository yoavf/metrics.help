import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://metrics.help';

async function main() {
  const urls = [];
  const today = new Date().toISOString().split('T')[0];

  // Homepage
  urls.push({
    loc: SITE_URL,
    priority: '1.0',
    changefreq: 'weekly',
  });

  // Process metrics
  const metricFiles = await glob('src/content/metrics/*.md', { cwd: join(__dirname, '..') });
  console.log(`Found ${metricFiles.length} metrics...`);

  for (const file of metricFiles) {
    const content = await readFile(join(__dirname, '..', file), 'utf-8');
    const { data } = matter(content);

    if (data.id) {
      urls.push({
        loc: `${SITE_URL}/metric/${data.id}`,
        priority: '0.8',
        changefreq: 'monthly',
      });
    }
  }

  // Process algorithms
  const algoFiles = await glob('src/content/algorithms/*.md', { cwd: join(__dirname, '..') });
  console.log(`Found ${algoFiles.length} algorithms...`);

  for (const file of algoFiles) {
    const content = await readFile(join(__dirname, '..', file), 'utf-8');
    const { data } = matter(content);

    if (data.id) {
      urls.push({
        loc: `${SITE_URL}/algorithm/${data.id}`,
        priority: '0.8',
        changefreq: 'monthly',
      });
    }
  }

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  const outputPath = join(__dirname, '../public/sitemap.xml');
  await writeFile(outputPath, sitemap);
  console.log(`\n✅ Sitemap generated with ${urls.length} URLs`);
}

main().catch(console.error);
