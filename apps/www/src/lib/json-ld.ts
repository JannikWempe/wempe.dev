import type { Person, WebPage, BlogPosting, ListItem, BreadcrumbList, Blog, WebSite } from 'schema-dts';
import { SITE_BASE_URL } from '~/constants/site';
import { LINKEDIN_URL, X_URL, GITHUB_URL, BLUESKY_URL } from '~/constants/socials';
import type { BlogTeaser } from './blog';

export function person(): Person {
	return {
		'@type': 'Person',
		name: 'Jannik Wempe',
		url: SITE_BASE_URL,
		image: new URL('/jannik-wempe.png', SITE_BASE_URL).toString(),
		sameAs: [X_URL, LINKEDIN_URL, GITHUB_URL, BLUESKY_URL],
	};
}

export function breadcrumbList(args: { items: ListItem[] }): BreadcrumbList {
	const { items } = args;

	return {
		'@type': 'BreadcrumbList',
		itemListElement: items,
	};
}

export function breadcrumbItem(args: { position: number; name: string; url: string }): ListItem {
	const { position, name, url } = args;

	return {
		'@type': 'ListItem',
		position,
		name,
		item: url,
	};
}

export function webSite(): WebSite {
	return {
		'@type': 'WebSite',
		name: 'Jannik Wempe',
		description: 'Jannik Wempe is a software engineer and entrepreneur.',
		author: person(),
		url: new URL('/', SITE_BASE_URL).toString(),
	};
}

export function webPage(): WebPage {
	return {
		'@type': 'WebPage',
		name: 'Jannik Wempe',
		description: 'Jannik Wempe is a software engineer and entrepreneur.',
		author: person(),
		url: new URL('/', SITE_BASE_URL).toString(),
		isPartOf: {
			'@type': 'WebSite',
			'@id': new URL('/', SITE_BASE_URL).toString(),
		},
	};
}

export function blog(args: { url: string; blogPosts: BlogPosting[] }): Blog {
	const { url, blogPosts } = args;

	return {
		'@type': 'Blog',
		name: 'Jannik Wempe',
		description: 'Jannik Wempe is a software engineer and entrepreneur.',
		url,
		publisher: person(),
		blogPost: blogPosts,
	};
}

export function blogPosting(args: { post: BlogTeaser<unknown> }): BlogPosting {
	const { post } = args;
	const postUrl = new URL(post.url, SITE_BASE_URL).toString();
	const coverSrc = typeof post.cover === 'object' && post.cover !== null && 'src' in post.cover
		? String((post.cover as { src: string }).src)
		: String(post.cover);

	return {
		'@type': 'BlogPosting',
		headline: post.title,
		author: person(),
		image: new URL(coverSrc, SITE_BASE_URL).toString(),
		datePublished: post.publishedAt.toISOString(),
		dateCreated: post.publishedAt.toISOString(),
		description: post.excerpt,
		wordCount: post.readingTime.words,
		timeRequired: `PT${Math.ceil(post.readingTime.minutes)}M`,
		url: postUrl,
		inLanguage: 'en-US',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': postUrl,
		},
		keywords: post.tags.join(', '),
		publisher: person(),
		isPartOf: {
			'@type': 'WebSite',
			'@id': new URL('/', SITE_BASE_URL).toString(),
		},
	};
}
