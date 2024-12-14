function fetchGql(query: string, variables: Record<string, any> = {}) {
	// TODO: use env var
	return fetch('https://gql.hashnode.com', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query,
			...(variables ? { variables } : {}),
		}),
	});
}

type Post = {
	id: string;
	title: string;
	slug: string;
	publishedAt: string;
	url: string;
	subtitle: string;
	brief: string;
	readTimeInMinutes: number;
	coverImage: {
		url: string;
		isPortrait: boolean;
	};
};

type GetBlogPostsQueryResponse = {
	publication: {
		id: string;
		posts: {
			edges: {
				node: Post;
			}[];
		};
	};
};

export async function getBlogPosts(limit: number) {
	const response = await fetchGql(
		`
    query GetBlogPosts($first: Int!) {
      publication(host: "blog.jannikwempe.com") {
        id
        posts(first: $first) {
          edges {
            node {
              id
              title
              slug
              publishedAt
              url
              subtitle
              brief
              readTimeInMinutes
              coverImage {
                url
                isPortrait
              }
            }
          }
        }
      }
    }
  `,
		{ first: limit },
	);

	const json = await response.json();

	if (json.errors) {
		console.error('Error fetching blog posts:', json.errors);
		return [];
	}

	const posts =
		(json.data as GetBlogPostsQueryResponse | null)?.publication?.posts?.edges?.map(({ node }) => node) ?? [];

	return posts;
}
