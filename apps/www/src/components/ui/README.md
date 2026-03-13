# UI primitives

Shared UI lives in `src/components/ui` and is imported directly by file path, for example `~/components/ui/Card.astro`.

## Design tokens

Semantic tokens are defined in `src/assets/styles/global.css`.

- `brand-*`: primary and secondary action colors
- `link-*`: accent and muted link treatments
- `card-*`: reusable card border and hover states
- `border-subtle`: subdued dividers for section chrome
- `focus-ring`: shared accessible focus color
- `shadow-card*`: default and interactive card elevation

## Components

### Card

Use for reusable surface containers with consistent border, elevation, hover, and focus behavior.

```astro
<Card as="article" interactive focusRing="within" class="group overflow-hidden">
	<slot />
</Card>
```

Props:

- `as`: polymorphic root element
- `padding`: `none | sm | md | lg | xl`
- `radius`: `lg | xl`
- `interactive`: enables hover elevation
- `focusRing`: `none | within | visible`

### SectionTitle

Use for compact section headings with an optional divider.

```astro
<SectionTitle>Work Experience</SectionTitle>
```

### SocialLink

Use for both icon-only and icon-with-text social/contact links.

```astro
<SocialLink
	href={GITHUB_URL}
	target="_blank"
	rel="noopener noreferrer"
	icon="lucide:github"
	label="GitHub Profile"
	analyticsType="github"
/>
```

If `text` is provided, the component renders the label beside the icon for list-style contact rows.
