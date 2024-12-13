import { Cloudinary } from '@cloudinary/url-gen';
import { config } from '~/constants/config';

export const cloudinary = new Cloudinary({
	cloud: {
		cloudName: extractCloudName(config.images.cdnPrefix),
	},
});

console.log(extractCloudName(config.images.cdnPrefix));

function extractCloudName(url: string) {
	const urlObj = new URL(url);
	const pathname = urlObj.pathname;
	const cloudName = pathname.split('/')[1];
	return cloudName;
}
