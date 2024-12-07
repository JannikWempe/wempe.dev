export const config = {
	site: {
		name: 'Jannik Wempe | Passionate Software Engineer',
		site: 'https://www.wempe.dev',
		base: '/',
		trailingSlash: false,
	},

	metadata: {
		title: {
			default: 'Jannik Wempe | Passionate Software Engineer',
			template: '%s — Jannik Wempe',
		},
		description: '',
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			site_name: 'Jannik Wempe',
			images: [
				{
					// TODO: change image
					url: '~/assets/images/default.png',
					width: 1200,
					height: 628,
				},
			],
			type: 'website',
		},
		twitter: {
			handle: '@JannikWempe',
			site: '@JannikWempe',
			cardType: 'summary_large_image',
		},
	},

	i18n: {
		language: 'en',
	},

	social: {
		x: 'https://x.com/JannikWempe',
		linkedin: 'https://www.linkedin.com/in/jannik-wempe',
		github: 'https://github.com/jannikwempe',
		hashnode: 'https://hashnode.com/@jannikwempe',
		email: 'jannik@wempe.dev',
	},

	images: {
		cdnPrefix: 'https://res.cloudinary.com/dsxtwvsly/image/upload',
	},
} as const;
