/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
	app(input) {
		return {
			name: 'wempe-dev',
			removal: input?.stage === 'prod' ? 'retain' : 'remove',
			home: 'aws',
			providers: {
				aws: {
					region: 'eu-central-1',
					profile: 'private',
				},
			},
		};
	},
	async run() {
		$transform(sst.aws.Function, (args, _opts) => {
			args.architecture ??= 'arm64';
			args.runtime ??= 'nodejs22.x';
		});

		const wwww = await import('./infra/www');

		return {
			url: wwww.astro.url,
		};
	},
});