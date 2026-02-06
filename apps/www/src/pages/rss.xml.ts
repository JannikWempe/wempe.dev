import rss, { type RSSOptions } from '@astrojs/rss';
import { getCollection } from 'astro:content';

import type { APIRoute } from 'astro';
import { SITE_BASE_URL, SITE_NAME } from '~/constants/site';
import { newestFirst } from '~/lib/blog';

export const GET: APIRoute = async (context) => {
  const blog = (await getCollection('blog')).toSorted(newestFirst);

  const items = blog.map((post) => ({
    title: post.data.title,
    pubDate: post.data.datePublished,
    categories: post.data.tags,
    description: post.data.excerpt,
    link: `/blog/${post.id}`,
    author: 'Jannik Wempe',
    trailingSlash: false,
  })) satisfies RSSOptions['items'];

  return rss({
    title: SITE_NAME,
    description: 'Blog Posts by Jannik Wempe.',
    site: context.site || SITE_BASE_URL,
    items,
    customData: `<language>en-us</language>`,
    stylesheet: '/pretty-feed-v3.xsl',
  });
};
