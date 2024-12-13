const SITE = 'https://www.wempe.dev';

export const config = {
	site: {
		name: 'Jannik Wempe | Passionate Software Engineer',
		site: SITE,
		base: '/',
		trailingSlash: false,
	},

	metadata: {
		title: {
			default: 'Jannik Wempe | Passionate Software Engineer',
			template: '%s — Jannik Wempe',
		},
		description:
			'Full-stack software engineer crafting high-impact web solutions. From frontend development to serverless architectures, I build scalable applications that solve real business challenges.',
		robots: {
			index: true,
			follow: true,
		},
		openGraph: {
			site_name: 'Jannik Wempe',
			images: [
				{
					url: `${SITE}/og.png`,
					width: 1200,
					height: 630,
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
		bluesky: 'https://bsky.app/profile/jannikwempe.com',
		linkedin: 'https://www.linkedin.com/in/jannik-wempe',
		github: 'https://github.com/jannikwempe',
		hashnode: 'https://hashnode.com/@jannikwempe',
		email: 'jannik@wempe.dev',
	},

	images: {
		cdnPrefix: 'https://res.cloudinary.com/dsxtwvsly/image/upload',
	},
} as const;
