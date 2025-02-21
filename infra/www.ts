import { hostname } from './dns';

export const astro = new sst.aws.Astro('Astro', {
	path: 'apps/www',
	dev: {
		autostart: true,
		command: 'astro dev',
	},
	domain: {
		name: hostname,
		dns: sst.cloudflare.dns(),
		redirects: [`www.${hostname}`],
	},
});

export const outputs = {
	www: astro.url,
};
