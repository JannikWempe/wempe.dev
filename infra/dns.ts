import { PRODUCTION_STAGE } from './stage';

export const hostname =
	{
		[PRODUCTION_STAGE]: 'wempe.dev',
	}[$app.stage] || $app.stage + '.dev.wempe.dev';

export const zone = cloudflare.getZoneOutput({
	name: 'wempe.dev',
});

if ($app.stage === PRODUCTION_STAGE) {
	// new cloudflare.Record("google-site-verification", {
	//   zoneId: zone.id,
	//   type: "TXT",
	//   name: "@",
	//   value:
	//     "google-site-verification=mWCYnJ71yBNKa20iwohRe8PJB8FNKSxEl4El262yd54",
	//   comment: "Google site verification",
	// });
}
