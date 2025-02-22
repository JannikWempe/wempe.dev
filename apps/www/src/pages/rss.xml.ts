import rss, { type RSSOptions } from '@astrojs/rss';
import { getCollection } from 'astro:content';

import type { APIRoute } from 'astro';
import { config } from '~/constants/config';
import { newestFirst } from '~/lib/blog';

export const GET: APIRoute = async (context) => {
	const blog = (await getCollection('blog')).sort(newestFirst);

	const items = blog.map((post) => ({
		title: post.data.title,
		pubDate: post.data.datePublished,
		description: post.data.excerpt,
		link: `/blog/${post.id}`,
		author: 'Jannik Wempe',
		trailingSlash: config.site.trailingSlash,
	})) satisfies RSSOptions['items'];

	return rss({
		title: config.site.name,
		description: 'Blog Posts by Jannik Wempe.',
		site: context.site || config.site.site,
		items,
		customData: `<language>en-us</language>`,
		stylesheet: '/pretty-feed-v3.xsl',
	});
};
