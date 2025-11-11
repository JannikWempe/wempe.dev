// @ts-check

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
		sitemap(),
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
