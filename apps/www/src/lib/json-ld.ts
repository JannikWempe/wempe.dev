import type { CollectionEntry } from 'astro:content';
import type { ReadTimeResults } from 'reading-time';
import type { Person, WebPage, BlogPosting, ListItem, BreadcrumbList, Blog } from 'schema-dts';
import { SITE_BASE_URL } from '~/constants/site';
import { isExternalCoverImage } from '~/utils/image';
import { LINKEDIN_URL, X_URL, GITHUB_URL, BLUESKY_URL } from '~/constants/socials';

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

export function webPage(): WebPage {
	return {
		'@type': 'WebPage',
		name: 'Jannik Wempe',
		description: 'Jannik Wempe is a software engineer and entrepreneur.',
		author: person(),
		url: new URL('/', SITE_BASE_URL).toString(),
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

export function blogPosting(args: { post: CollectionEntry<'blog'>; readingTime: ReadTimeResults }): BlogPosting {
	const { post, readingTime } = args;
	const postUrl = new URL(`/blog/${post.id}`, SITE_BASE_URL).toString();

	return {
		'@type': 'BlogPosting',
		headline: post.data.title,
		author: person(),
		image: isExternalCoverImage(post.data.cover)
			? post.data.cover
			: new URL(post.data.cover.src, SITE_BASE_URL).toString(),
		datePublished: post.data.datePublished.toISOString(),
		dateCreated: post.data.datePublished.toISOString(),
		description: post.data.excerpt,
		wordCount: readingTime.words,
		timeRequired: `PT${Math.ceil(readingTime.minutes)}M`,
		url: postUrl,
		inLanguage: 'en-US',
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': postUrl,
		},
		keywords: post.data.tags?.join(', '),
		publisher: person(),
	};
}
