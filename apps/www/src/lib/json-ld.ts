import type { CollectionEntry } from 'astro:content';
import type { ReadTimeResults } from 'reading-time';
import type { Person, WebPage, BlogPosting, ListItem, BreadcrumbList, Blog, WebSite } from 'schema-dts';
import { SITE_BASE_URL } from '~/constants/site';
import { LINKEDIN_URL, X_URL, GITHUB_URL, BLUESKY_URL } from '~/constants/socials';
import type { BlogReadingTime, BlogTeaser } from './blog';

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

export function blogPosting(args: {
	post: CollectionEntry<'blog'> | BlogTeaser;
	readingTime: ReadTimeResults | BlogReadingTime;
}): BlogPosting {
	const { post, readingTime } = args;
	const isTeaser = 'url' in post;
	const postUrl = new URL(isTeaser ? post.url : `/blog/${post.data.slug}`, SITE_BASE_URL).toString();
	const title = isTeaser ? post.title : post.data.title;
	const cover = isTeaser ? post.cover : post.data.cover;
	const publishedAt = isTeaser ? post.publishedAt : post.data.datePublished;
	const excerpt = isTeaser ? post.excerpt : post.data.excerpt;
	const tags = isTeaser ? post.tags : post.data.tags;

	return {
		'@type': 'BlogPosting',
		headline: title,
		author: person(),
		image: new URL(cover.src, SITE_BASE_URL).toString(),
		datePublished: publishedAt.toISOString(),
		dateCreated: publishedAt.toISOString(),
		...(!isTeaser && post.data.dateLastModified && { dateModified: post.data.dateLastModified.toISOString() }),
		description: excerpt,
		wordCount: readingTime.words,
		timeRequired: `PT${Math.ceil(readingTime.minutes)}M`,
		url: postUrl,
		inLanguage: 'en-US',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': postUrl,
		},
		keywords: tags?.join(', '),
		publisher: person(),
		isPartOf: {
			'@type': 'WebSite',
			'@id': new URL('/', SITE_BASE_URL).toString(),
		},
	};
}
