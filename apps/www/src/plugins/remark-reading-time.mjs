import getReadingTime from 'reading-time';
import { toString } from 'mdast-util-to-string';

/**
 * Adds a `minutesRead` property to the frontmatter of the post.
 * @see https://docs.astro.build/en/recipes/reading-time/
 */
export function remarkReadingTime() {
	return function (tree, { data }) {
		const textOnPage = toString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.readingTime = readingTime;
	};
}
