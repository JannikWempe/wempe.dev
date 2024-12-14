import path from 'path';
import { fileURLToPath } from 'url';

import { imageService } from '@unpic/astro/service';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'astro/config';

import sst from 'astro-sst';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';
import { config } from './src/constants/config';

import icon from 'astro-icon';

import partytown from '@astrojs/partytown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
	site: config.site.site,
	base: config.site.base,
	trailingSlash: config.site.trailingSlash ? 'always' : 'never',

	image: {
		service: imageService({
			placeholder: 'blurhash',
		}),
	},
	server: { host: true },
	adapter: sst(),
	output: 'server',
	integrations: [
		tailwind(),
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
	],
	vite: {
		plugins: [tsconfigPaths()],
	},
});
