import type { CollectionEntry } from 'astro:content';

export const newestFirst = (a: CollectionEntry<'blog'>, z: CollectionEntry<'blog'>) =>
	z.data.datePublished.getTime() - a.data.datePublished.getTime();
