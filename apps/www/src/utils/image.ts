export type ImageSource = string | { src: string };

export function getCoverImageSrc(cover: ImageSource): string {
	return typeof cover === 'string' ? cover : cover.src;
}

export const isExternalCoverImage = (image: unknown): image is string =>
	typeof image === 'string' && image.startsWith('http');
