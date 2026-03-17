import rss from '@astrojs/rss';

import type { APIRoute } from 'astro';
import { SITE_BASE_URL, SITE_NAME } from '~/constants/site';
import { createBlogReadModel } from '~/lib/blog';

export const GET: APIRoute = async (context) => {
	const blog = createBlogReadModel();
	const { items } = await blog.list({ kind: 'all' });

	return rss({
		title: SITE_NAME,
		description: 'Blog Posts by Jannik Wempe.',
		site: context.site || SITE_BASE_URL,
		items: items.map((post) => post.toRssItem()),
		customData: `<language>en-us</language>`,
		stylesheet: '/pretty-feed-v3.xsl',
	});
};
