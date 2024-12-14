import { PRODUCTION_STAGE } from './stage';

export const hostname =
	{
		[PRODUCTION_STAGE]: 'wempe.dev',
	}[$app.stage] || $app.stage + '.dev.wempe.dev';

export const zone = cloudflare.getZoneOutput({
	name: 'wempe.dev',
});

if ($app.stage === PRODUCTION_STAGE) {
	new cloudflare.Record('GoogleSiteVerification', {
		zoneId: zone.id,
		type: 'TXT',
		name: '@',
		value: '"google-site-verification=_Yl9h69vYYhaMqvnu9BfzG7Ko5SeOuQ0hCwFQvFZui8"',
		comment: 'Google site verification',
	});

	// new cloudflare.PageRule('RedirectCal', {
	// 	zoneId: zone.id,
	// 	target: `${hostname}/cal`,
	// 	actions: {
	// 		forwardingUrl: {
	// 			url: 'https://cal.com/jannikwempe',
	// 			statusCode: 302,
	// 		},
	// 	},
	// 	priority: 1,
	// });
}
