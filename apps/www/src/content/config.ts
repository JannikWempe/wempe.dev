import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
	schema: z.object({
		slug: z.string(),
		title: z.string(),
		cover: z.string().url(),
		datePublished: z.coerce.date(), // ISO date string
		excerpt: z.string(),

		seoTitle: z.string().optional(),
		seoDescription: z.string().optional(),
		ogImage: z.string().url().optional(),
		tags: z.string().transform((val) => val.split(',')),
	}),
});

export const collections = {
	blog,
};
