export type ImageSource = string | { src: string };

export function getCoverImageSrc(cover: ImageSource): string {
	return typeof cover === 'string' ? cover : cover.src;
}
