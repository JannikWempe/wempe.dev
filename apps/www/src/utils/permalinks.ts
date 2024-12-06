import { config } from '~/constants/metadata';
import { trim } from '~/utils/misc';

export const trimSlash = (s: string) => trim(trim(s, '/'));

export const getCanonical = (path: string): string | URL => {
	const url = String(new URL(path, config.site.site));
	if (config.site.trailingSlash == false && path && url.endsWith('/')) {
		return url.slice(0, -1);
	} else if ((config.site.trailingSlash as boolean) == true && path && !url.endsWith('/')) {
		return url + '/';
	}
	return url;
};
