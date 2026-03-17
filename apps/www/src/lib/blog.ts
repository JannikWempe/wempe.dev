import type { ImageMetadata } from 'astro';
import type { CollectionEntry } from 'astro:content';

export type BlogReadingTime = {
	text: string;
	minutes: number;
	words: number;
};

export type BlogSourceEntry<TCover = ImageMetadata> = {
	id: string;
	data: {
		slug: string;
		title: string;
		subtitle?: string;
		excerpt: string;
		cover: TCover;
		datePublished: Date;
		tags?: readonly string[];
	};
};

type BlogRenderResult = {
	remarkPluginFrontmatter?: {
		readingTime?: BlogReadingTime;
	};
};

export type BlogTeaser<TCover = ImageMetadata> = {
	id: string;
	slug: string;
	url: `/blog/${string}`;
	title: string;
	subtitle?: string;
	excerpt: string;
	cover: TCover;
	publishedAt: Date;
	tags: readonly string[];
	readingTime: BlogReadingTime;
};

export type BlogReadModelDependencies<TCover = ImageMetadata> = {
	listEntries?: () => Promise<readonly BlogSourceEntry<TCover>[]>;
	renderEntry?: (entry: BlogSourceEntry<TCover>) => Promise<BlogRenderResult>;
};

export type BlogCatalog = {
	postParams: { slug: string }[];
	tagParams: { slug: string }[];
	tags: Set<string>;
};

export type BlogReadModel<TCover = ImageMetadata> = {
	list(query: BlogListQuery): Promise<{
		items: BlogTeaser<TCover>[];
		total: number;
	}>;
	catalog(): Promise<BlogCatalog>;
};

export type BlogListQuery =
	| { kind: 'latest'; limit: number }
	| { kind: 'all' }
	| { kind: 'tag'; tag: string };

type SortableByDate = {
	data: {
		datePublished: Date;
	};
};

export const newestFirst = <TEntry extends SortableByDate>(a: TEntry, z: TEntry) =>
	z.data.datePublished.getTime() - a.data.datePublished.getTime();

export function createBlogReadModel<TCover = ImageMetadata>(
	deps: BlogReadModelDependencies<TCover> = {},
): BlogReadModel<TCover> {
	const listEntries = deps.listEntries ?? defaultListEntries<TCover>;
	const renderEntry = deps.renderEntry ?? defaultRenderEntry<TCover>;
	const renderCache = new Map<string, Promise<BlogRenderResult>>();
	let teaserCache: Promise<BlogTeaser<TCover>[]> | undefined;

	const getRenderResult = (entry: BlogSourceEntry<TCover>) => {
		let cached = renderCache.get(entry.id);

		if (!cached) {
			cached = renderEntry(entry);
			renderCache.set(entry.id, cached);
		}

		return cached;
	};

	const getAllTeasers = async () => {
		teaserCache ??= listEntries().then((entries) =>
			Promise.all(entries.toSorted(newestFirst).map(async (entry) => toBlogTeaser(entry, await getRenderResult(entry)))),
		);

		return teaserCache;
	};

	return {
		async list(query) {
			const items = await getAllTeasers();

			if (query.kind === 'tag') {
				const filtered = items.filter((t) => t.tags.includes(query.tag));
				return { items: filtered, total: filtered.length };
			}

			const total = items.length;

			if (query.kind === 'all') {
				return { items: items.slice(), total };
			}

			return { items: items.slice(0, Math.max(0, query.limit)), total };
		},

		async catalog() {
			const items = await getAllTeasers();
			const tags = new Set<string>();

			for (const item of items) {
				for (const tag of item.tags) tags.add(tag);
			}

			return {
				postParams: items.map((item) => ({ slug: item.slug })),
				tagParams: Array.from(tags).map((tag) => ({ slug: tag })),
				tags,
			};
		},
	};
}

function toBlogTeaser<TCover>(entry: BlogSourceEntry<TCover>, renderResult: BlogRenderResult): BlogTeaser<TCover> {
	const readingTime = renderResult.remarkPluginFrontmatter?.readingTime;

	if (!readingTime) {
		throw new Error(`Missing reading time for blog entry "${entry.id}"`);
	}

	return {
		id: entry.id,
		slug: entry.data.slug,
		url: `/blog/${entry.data.slug}`,
		title: entry.data.title,
		subtitle: entry.data.subtitle,
		excerpt: entry.data.excerpt,
		cover: entry.data.cover,
		publishedAt: entry.data.datePublished,
		tags: [...(entry.data.tags ?? [])],
		readingTime,
	};
}

async function defaultListEntries<TCover>(): Promise<readonly BlogSourceEntry<TCover>[]> {
	const { getCollection } = await import('astro:content');

	return (await getCollection('blog')) as unknown as readonly BlogSourceEntry<TCover>[];
}

async function defaultRenderEntry<TCover>(entry: BlogSourceEntry<TCover>): Promise<BlogRenderResult> {
	const { render } = await import('astro:content');

	return (await render(entry as unknown as CollectionEntry<'blog'>)) as BlogRenderResult;
}
