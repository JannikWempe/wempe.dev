export const astro = new sst.aws.Astro('Astro', {
	path: './apps/www',
});

export const outputs = {
	www: astro.url,
};
