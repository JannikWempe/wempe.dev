// basically reflects the default SST cache policy
// but excludes 'p' from query string caching

import { hostname } from './dns';

// since that is changing for server islands and causes cache misses
const cachePolicy = new aws.cloudfront.CachePolicy('AstroServerCachePolicy', {
	comment: 'Custom cache policy for Astro server',
	minTtl: 0,
	maxTtl: 31536000,
	defaultTtl: 0,
	parametersInCacheKeyAndForwardedToOrigin: {
		enableAcceptEncodingBrotli: true,
		enableAcceptEncodingGzip: true,
		cookiesConfig: {
			cookieBehavior: 'none',
		},
		headersConfig: {
			headerBehavior: 'none',
		},
		queryStringsConfig: {
			queryStringBehavior: 'allExcept',
			queryStrings: {
				items: ['p'],
			},
		},
	},
});

export const astro = new sst.aws.Astro('Astro', {
	path: './apps/www',
	cachePolicy: cachePolicy.id,
	domain: {
		name: hostname,
		dns: sst.cloudflare.dns(),
		redirects: [`www.${hostname}`],
	},
});

export const outputs = {
	www: astro.url,
};
