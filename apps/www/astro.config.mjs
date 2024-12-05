// @ts-check
import { defineConfig } from 'astro/config';

import sst from 'astro-sst';

import tailwind from '@astrojs/tailwind';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.wempe.dev',
	server: { host: true },
	adapter: sst(),
	output: 'server',
	integrations: [tailwind(), sitemap()],
	redirects: { '/cal': 'https://cal.com/jannikwempe/30min' },
});
