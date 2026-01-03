// @ts-check

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'astro/config';
import sst from 'astro-sst';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import expressiveCode from 'astro-expressive-code';
import mdx from '@astrojs/mdx';

import { SITE_BASE_PATH, SITE_BASE_URL } from './src/constants/site';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';

const blogMeta = getBlogMetaMap();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	experimental: {
		clientPrerender: true,
		contentIntellisense: true,
		preserveScriptOrder: true,
		csp: false,
	},
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'hover',
	},
	site: SITE_BASE_URL,
	base: SITE_BASE_PATH,
	trailingSlash: 'never',
	server: { host: true },
	adapter: sst({
		responseMode: 'buffer',
	}),
	output: 'server',
	redirects: {
		'/cal': {
			destination: 'https://cal.com/jannikwempe',
			status: 302,
		},
		'/sitemap.xml': {
			destination: '/sitemap-index.xml',
			status: 302,
		},
		// on Hashnode, I have used some series, now I use tags instead
		'/blog/series/domain-driven-design': {
			destination: '/blog/tag/ddd',
			status: 301,
		},
		'/blog/series/podcast-notes': {
			destination: '/blog/tag/podcast',
			status: 301,
		},
		'/blog/series/state-machines': {
			destination: '/blog/tag/state-machines',
			status: 301,
		},
	},
	integrations: [
		sitemap({
			serialize(item) {
				const blogMatch = item.url.match(/\/blog\/([^/]+)$/);
				if (blogMatch) {
					const meta = blogMeta.get(blogMatch[1]);
					if (meta?.date) {
						item.lastmod = new Date(meta.date).toISOString();
					}
				}
				return item;
			},
		}),
		icon({
			iconDir: path.resolve(__dirname, './src/assets/icons'),
			include: {
				// TODO: only list the icons that are actually used
				lucide: ['*'],
				logos: ['*'],
			},
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						params: {
							overrides: {
								cleanupIds: false,
							},
						},
					},
				],
			},
		}),
		expressiveCode({ themes: ['night-owl'] }),
		mdx({
			remarkPlugins: [remarkReadingTime],
		}),
	],
	vite: {
		plugins: [tsconfigPaths(), tailwindcss()],
	},
});

function getBlogMetaMap() {
	const blogDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src/content/blog');
	const meta = new Map();

	for (const entry of fs.readdirSync(blogDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const postPath = path.join(blogDir, entry.name, 'post.mdx');
		const mdPath = path.join(blogDir, entry.name, 'post.md');
		const filePath = fs.existsSync(postPath) ? postPath : fs.existsSync(mdPath) ? mdPath : null;
		if (!filePath) continue;

		const content = fs.readFileSync(filePath, 'utf-8');
		const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
		if (!frontmatterMatch) continue;

		const fm = frontmatterMatch[1];
		const slugMatch = fm.match(/^slug:\s*["']?([^"'\n]+)["']?/m);
		const lastModMatch = fm.match(/^dateLastModified:\s*["']?([^"'\n]+)["']?/m);
		const pubMatch = fm.match(/^datePublished:\s*["']?([^"'\n]+)["']?/m);
		const titleMatch = fm.match(/^title:\s*["']?([^"'\n]+)["']?/m);
		const coverMatch = fm.match(/^cover:\s*["']?\.\/images\/([^"'\n]+)["']?/m);

		if (slugMatch) {
			meta.set(slugMatch[1], {
				date: lastModMatch?.[1] || pubMatch?.[1],
				title: titleMatch?.[1],
				coverBase: coverMatch?.[1]?.replace(/\.\w+$/, ''), // e.g. "x1VLIrLOw" from "./images/x1VLIrLOw.webp"
			});
		}
	}
	return meta;
}
