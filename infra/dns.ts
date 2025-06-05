import { PRODUCTION_STAGE } from './stage';

export const hostname =
	{
		[PRODUCTION_STAGE]: 'wempe.dev',
	}[$app.stage] || $app.stage + '.dev.wempe.dev';

const WEMPE_DEV_ZONE_ID = 'bfb27c153bb39b58b29c5f3960cb83e8';

export const zone = cloudflare.getZoneOutput({
	zoneId: WEMPE_DEV_ZONE_ID,
});

if ($app.stage === PRODUCTION_STAGE) {
	new cloudflare.DnsRecord('GoogleSiteVerification', {
		zoneId: WEMPE_DEV_ZONE_ID,
		type: 'TXT',
		name: '@',
		content: '"google-site-verification=_Yl9h69vYYhaMqvnu9BfzG7Ko5SeOuQ0hCwFQvFZui8"',
		comment: 'Google site verification',
		ttl: 600,
	});
}
