import assert from 'node:assert/strict';
import test from 'node:test';
import { createBlogReadModel, type BlogSourceEntry, type BlogTeaser } from './blog.ts';

function createFixtureEntries(): BlogSourceEntry<string>[] {
	return [
		{
			id: 'older-post',
			body: 'Older body content',
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
			body: 'Newest body content',
			data: {
				slug: 'newest-post',
				title: 'Newest Post',
				subtitle: 'A subtitle',
				excerpt: 'Newest excerpt',
				cover: 'newest-cover',
				datePublished: new Date('2025-03-01T00:00:00.000Z'),
				tags: ['typescript', 'astro'],
				seoTitle: 'Custom SEO Title',
				seoDescription: 'Custom SEO Description',
			},
		},
		{
			id: 'middle-post',
			body: 'Middle body content',
			data: {
				slug: 'middle-post',
				title: 'Middle Post',
				excerpt: 'Middle excerpt',
				cover: 'middle-cover',
				datePublished: new Date('2024-06-15T00:00:00.000Z'),
			},
		},
	];
}

function createFixtureRenderEntry() {
	return async (entry: BlogSourceEntry<string>) => ({
		Content: `Content:${entry.id}`,
		headings: [{ depth: 2, slug: `heading-${entry.id}`, text: `Heading ${entry.data.title}` }],
		remarkPluginFrontmatter: {
			readingTime: {
				text: `${entry.data.title} read`,
				minutes: entry.data.title.length / 2,
				words: entry.data.title.length * 42,
			},
		},
	});
}

function createFixtureToJsonLd() {
	return (teaser: BlogTeaser<string>) => ({
		'@type': 'BlogPosting' as const,
		headline: teaser.title,
		description: teaser.excerpt,
		datePublished: teaser.publishedAt.toISOString(),
		wordCount: teaser.readingTime.words,
		timeRequired: `PT${Math.ceil(teaser.readingTime.minutes)}M`,
		url: `https://wempe.dev${teaser.url}`,
		keywords: teaser.tags.join(', '),
		inLanguage: 'en-US',
	});
}

function createFixtureReadModel() {
	return createBlogReadModel<string>({
		listEntries: async () => createFixtureEntries(),
		renderEntry: createFixtureRenderEntry(),
		toJsonLd: createFixtureToJsonLd(),
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

test('post by id returns rendered content, headings, seo fields, and navigation', async () => {
	const readModel = createFixtureReadModel();

	const post = await readModel.post({ id: 'middle-post' });

	assert.ok(post);
	assert.equal(post.slug, 'middle-post');
	assert.equal(post.content, 'Content:middle-post');
	assert.deepEqual(post.headings, [{ depth: 2, slug: 'heading-middle-post', text: 'Heading Middle Post' }]);
	assert.equal(post.seoTitle, 'Middle Post');
	assert.equal(post.seoDescription, 'Middle excerpt');
	assert.equal(post.body, 'Middle body content');
	// newest(idx 0) -> middle(idx 1) -> older(idx 2)
	assert.equal(post.navigation.previous?.slug, 'older-post');
	assert.equal(post.navigation.next?.slug, 'newest-post');
});

test('post by slug returns the same post as by id', async () => {
	const readModel = createFixtureReadModel();

	const post = await readModel.post({ slug: 'middle-post' });

	assert.ok(post);
	assert.equal(post.id, 'middle-post');
	assert.equal(post.slug, 'middle-post');
});

test('post uses custom seo fields when present', async () => {
	const readModel = createFixtureReadModel();

	const post = await readModel.post({ id: 'newest-post' });

	assert.ok(post);
	assert.equal(post.seoTitle, 'Custom SEO Title');
	assert.equal(post.seoDescription, 'Custom SEO Description');
});

test('post returns null for navigation at boundaries', async () => {
	const readModel = createFixtureReadModel();

	const newest = await readModel.post({ id: 'newest-post' });
	assert.ok(newest);
	assert.equal(newest.navigation.next, null);
	assert.equal(newest.navigation.previous?.slug, 'middle-post');

	const oldest = await readModel.post({ id: 'older-post' });
	assert.ok(oldest);
	assert.equal(oldest.navigation.previous, null);
	assert.equal(oldest.navigation.next?.slug, 'middle-post');
});

test('post returns null for unknown ref', async () => {
	const readModel = createFixtureReadModel();

	assert.equal(await readModel.post({ id: 'nonexistent' }), null);
	assert.equal(await readModel.post({ slug: 'nonexistent' }), null);
});

test('toRssItem returns correct RSS feed item', async () => {
	const readModel = createFixtureReadModel();

	const { items } = await readModel.list({ kind: 'latest', limit: 1 });
	const rssItem = items[0]!.toRssItem();

	assert.equal(rssItem.title, 'Newest Post');
	assert.equal(rssItem.link, '/blog/newest-post');
	assert.equal(rssItem.description, 'Newest excerpt');
	assert.equal(rssItem.author, 'Jannik Wempe');
	assert.deepEqual(rssItem.categories, ['typescript', 'astro']);
	assert.deepEqual(rssItem.pubDate, new Date('2025-03-01T00:00:00.000Z'));
});

test('toJsonLd returns correct BlogPosting schema', async () => {
	const readModel = createFixtureReadModel();

	const { items } = await readModel.list({ kind: 'latest', limit: 1 });
	const jsonLd = items[0]!.toJsonLd();

	assert.equal(jsonLd['@type'], 'BlogPosting');
	assert.equal(jsonLd.headline, 'Newest Post');
	assert.equal(jsonLd.description, 'Newest excerpt');
	assert.equal(jsonLd.datePublished, '2025-03-01T00:00:00.000Z');
	assert.equal(jsonLd.wordCount, 462);
	assert.equal(jsonLd.timeRequired, 'PT6M');
	assert.equal(jsonLd.keywords, 'typescript, astro');
	assert.equal(jsonLd.inLanguage, 'en-US');
	assert.ok(String(jsonLd.url).includes('/blog/newest-post'));
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
