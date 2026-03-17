import assert from 'node:assert/strict';
import test from 'node:test';
import { createBlogReadModel, type BlogSourceEntry } from './blog.ts';

function createFixtureReadModel() {
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

	return createBlogReadModel<string>({
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
}

test('list latest returns newest teasers with canonical urls and reading time', async () => {
	const readModel = createFixtureReadModel();

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

test('list all returns full newest-first catalog with enriched teasers', async () => {
	const readModel = createFixtureReadModel();

	const allPosts = await readModel.list({ kind: 'all' });

	assert.equal(allPosts.total, 3);
	assert.deepEqual(
		allPosts.items.map((item) => item.slug),
		['newest-post', 'middle-post', 'older-post'],
	);
	assert.deepEqual(
		allPosts.items.map((item) => item.readingTime.words),
		[462, 462, 420],
	);
});

test('list by tag returns matching posts newest-first', async () => {
	const readModel = createFixtureReadModel();

	const astroPosts = await readModel.list({ kind: 'tag', tag: 'astro' });

	assert.equal(astroPosts.total, 2);
	assert.deepEqual(
		astroPosts.items.map((item) => item.slug),
		['newest-post', 'older-post'],
	);
});

test('list by tag returns empty for unknown tag', async () => {
	const readModel = createFixtureReadModel();

	const result = await readModel.list({ kind: 'tag', tag: 'nonexistent' });

	assert.equal(result.total, 0);
	assert.deepEqual(result.items, []);
});

test('catalog returns post params, tag params, and tag set', async () => {
	const readModel = createFixtureReadModel();

	const catalog = await readModel.catalog();

	assert.deepEqual(catalog.postParams, [
		{ slug: 'newest-post' },
		{ slug: 'middle-post' },
		{ slug: 'older-post' },
	]);
	assert.deepEqual(
		catalog.tagParams.toSorted((a, b) => a.slug.localeCompare(b.slug)),
		[{ slug: 'astro' }, { slug: 'typescript' }],
	);
	assert.deepEqual(catalog.tags, new Set(['typescript', 'astro']));
});
