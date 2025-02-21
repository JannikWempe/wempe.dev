import path from 'path';
import { fileURLToPath } from 'url';

import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'astro/config';

import sst from 'astro-sst';

import sitemap from '@astrojs/sitemap';
import { config } from './src/constants/config';

import icon from 'astro-icon';

import partytown from '@astrojs/partytown';

import tailwindcss from '@tailwindcss/vite';

import expressiveCode from 'astro-expressive-code';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: config.site.site,
	base: config.site.base,
	trailingSlash: config.site.trailingSlash ? 'always' : 'never',
	server: { host: true },
	adapter: sst({
		deploymentStrategy: 'regional',
		responseMode: 'buffer',
	}),
	output: 'server',
	image: {
		domains: ['cdn.hashnode.com'],
	},
	redirects: {
		'/cal': {
			destination: 'https://cal.com/jannikwempe',
			status: 302,
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
		partytown(),
		expressiveCode({ themes: ['night-owl'] }),
	],
	vite: {
		plugins: [tsconfigPaths(), tailwindcss()],
	},
});
