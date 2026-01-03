import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: '**/post.{md,mdx}', base: './src/content/blog' }),
	schema: ({ image }) =>
		z.object({
			slug: z.string(),
			title: z.string(),
			subtitle: z.string().optional(),
			cover: image(),
			datePublished: z.coerce.date(), // ISO date string
			dateLastModified: z.coerce.date().optional(),
			excerpt: z.string(),

			seoTitle: z.string().optional(),
			seoDescription: z.string().optional(),
			ogImage: image().optional(),
			tags: z.array(z.string()).default([]),
		}),
});

const projects = defineCollection({
	loader: file('./src/content/projects/projects.json'),
	schema: ({ image }) =>
		z.object({
			type: z.enum(['website', 'Shopify app', 'SaaS', 'eCommerce', 'PWA']),
			title: z.string(),
			description: z.string(),
			url: z.string().url().optional(),
			logo: image(),
			status: z.enum(['ongoing', 'done', 'paused', 'sold', 'sunset']),
			tech: z.array(z.string()),
		}),
});

export const collections = {
	blog,
	projects,
};
