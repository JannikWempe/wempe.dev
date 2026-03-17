import assert from 'node:assert/strict';
import test from 'node:test';
import { createBlogReadModel, type BlogSourceEntry } from './blog.ts';

test('list latest returns newest teasers with canonical urls and reading time', async () => {
	const entries: BlogSourceEntry<string>[] = [
		{
			id: 'older-post',
			data: {
				slug: 'older-post',
				title: 'Older Post',
				excerpt: 'Older excerpt',
				cover: 'older-cover',
				datePublished: new Date('2024-01-10T00:00:00.000Z'),
				tags: ['astro'],
			},
		},
		{
			id: 'newest-post',
			data: {
				slug: 'newest-post',
				title: 'Newest Post',
				excerpt: 'Newest excerpt',
				cover: 'newest-cover',
				datePublished: new Date('2025-03-01T00:00:00.000Z'),
				tags: ['typescript', 'astro'],
			},
		},
		{
			id: 'middle-post',
			data: {
				slug: 'middle-post',
				title: 'Middle Post',
				excerpt: 'Middle excerpt',
				cover: 'middle-cover',
				datePublished: new Date('2024-06-15T00:00:00.000Z'),
			},
		},
	];

	const readModel = createBlogReadModel<string>({
		listEntries: async () => entries,
		renderEntry: async (entry) => ({
			remarkPluginFrontmatter: {
				readingTime: {
					text: `${entry.data.title} read`,
					minutes: entry.data.title.length / 2,
					words: entry.data.title.length * 42,
				},
			},
		}),
	});

	const latest = await readModel.list({ kind: 'latest', limit: 2 });

	assert.equal(latest.total, 3);
	assert.deepEqual(
		latest.items.map((item) => item.slug),
		['newest-post', 'middle-post'],
	);
	assert.deepEqual(
		latest.items.map((item) => item.url),
		['/blog/newest-post', '/blog/middle-post'],
	);
	assert.deepEqual(
		latest.items.map((item) => item.readingTime.text),
		['Newest Post read', 'Middle Post read'],
	);
});
