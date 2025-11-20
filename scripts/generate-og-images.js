import { ImageResponse } from '@vercel/og';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import matter from 'gray-matter';
import { readFile } from 'fs/promises';
import React from 'react';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Fetch JetBrains Mono font
const monoFontData = await fetch(
  'https://github.com/JetBrains/JetBrainsMono/raw/master/fonts/ttf/JetBrainsMono-Bold.ttf'
).then((res) => res.arrayBuffer());

async function generateOGImage(title, type = 'metric') {
  const bgColor = type === 'metric' ? '#FFE74C' : '#FF6B9D';

  return new ImageResponse(
    React.createElement(
      'div',
      {
        style: {
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAFAF9',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }
      },
      [
        React.createElement('div', {
          key: 'bg-decoration',
          style: {
            position: 'absolute',
            top: '40px',
            right: '40px',
            width: '200px',
            height: '200px',
            backgroundColor: bgColor,
            border: '4px solid #000',
            transform: 'rotate(12deg)',
            display: 'flex',
          }
        }),
        React.createElement('div', {
          key: 'content',
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
            maxWidth: '900px',
          }
        }, [
          React.createElement('div', {
            key: 'title',
            style: {
              fontSize: '72px',
              fontWeight: '900',
              color: '#000',
              textAlign: 'center',
              marginBottom: '40px',
              lineHeight: '1.1',
              letterSpacing: type === 'home' ? '-0.02em' : '0',
              fontFamily: '"JetBrains Mono", monospace',
            }
          }, title),
          React.createElement('div', {
            key: 'domain',
            style: {
              fontSize: '42px',
              fontWeight: '700',
              color: '#52525B',
              textAlign: 'center',
              backgroundColor: bgColor,
              padding: '20px 40px',
              border: '3px solid #000',
            }
          }, 'metrics.help')
        ])
      ]
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: monoFontData,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}

async function main() {
  const outputDir = join(__dirname, '../public/og');

  // Create output directory
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  // Generate homepage OG image
  console.log('Generating homepage OG image...');
  const homepageImage = await generateOGImage(
    'Simple, visual explanations for ML metrics & algorithms',
    'home'
  );
  const homepageBuffer = Buffer.from(await homepageImage.arrayBuffer());
  await writeFile(join(outputDir, 'home.png'), homepageBuffer);
  console.log('✓ Homepage OG image generated');

  // Process metrics
  const metricFiles = await glob('src/content/metrics/*.md', { cwd: join(__dirname, '..') });
  console.log(`\nGenerating OG images for ${metricFiles.length} metrics...`);

  for (const file of metricFiles) {
    const content = await readFile(join(__dirname, '..', file), 'utf-8');
    const { data } = matter(content);

    if (data.id && data.name) {
      const title = `What is ${data.name}?`;
      const image = await generateOGImage(title, 'metric');
      const buffer = Buffer.from(await image.arrayBuffer());
      await writeFile(join(outputDir, `metric-${data.id}.png`), buffer);
      console.log(`✓ Generated OG image for metric: ${data.name}`);
    }
  }

  // Process algorithms
  const algoFiles = await glob('src/content/algorithms/*.md', { cwd: join(__dirname, '..') });
  console.log(`\nGenerating OG images for ${algoFiles.length} algorithms...`);

  for (const file of algoFiles) {
    const content = await readFile(join(__dirname, '..', file), 'utf-8');
    const { data } = matter(content);

    if (data.id && data.name) {
      const title = `What is ${data.name}?`;
      const image = await generateOGImage(title, 'algorithm');
      const buffer = Buffer.from(await image.arrayBuffer());
      await writeFile(join(outputDir, `algorithm-${data.id}.png`), buffer);
      console.log(`✓ Generated OG image for algorithm: ${data.name}`);
    }
  }

  console.log('\n✅ All OG images generated successfully!');
}

main().catch(console.error);
