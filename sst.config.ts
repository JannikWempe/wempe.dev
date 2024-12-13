/// <reference path="./.sst/platform/config.d.ts" />
import { PRODUCTION_STAGE } from './infra/stage';
export default $config({
	app(input) {
		return {
			name: 'wempe-dev',
			removal: input?.stage === PRODUCTION_STAGE ? 'retain' : 'remove',
			home: 'aws',
			providers: {
				aws: {
					region: 'eu-central-1',
					profile: 'private',
				},
				cloudflare: '5.45.0',
			},
		};
	},
	async run() {
		$transform(sst.aws.Function, (args, _opts) => {
			args.architecture ??= 'arm64';
			args.runtime ??= 'nodejs22.x';
		});
		await import('./infra/dns');
		const wwww = await import('./infra/www');
		return {
			url: wwww.astro.url,
		};
	},
});
