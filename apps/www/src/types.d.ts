declare global {
	interface Window {
		plausible: any;
	}
}

export interface MetaData {
	title?: string;
	ignoreTitleTemplate?: boolean;

	canonical?: string;

	robots?: MetaDataRobots;

	description?: string;

	openGraph?: MetaDataOpenGraph;
	twitter?: MetaDataTwitter;
}
