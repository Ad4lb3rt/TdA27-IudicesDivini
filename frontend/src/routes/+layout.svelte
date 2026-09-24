<script lang="ts">
	import '../app.css';
	import '@fontsource/geist-sans/400.css';
	import '@fontsource/geist-sans/500.css';
	import '@fontsource/geist-sans/600.css';
	import '@fontsource/geist-sans/700.css';

	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="page">
	<main>
		{@render children()}
	</main>

	<footer>
		<p>Built with ❤️ by {data.teamName} - {data.teamMembers[0]}, {data.teamMembers[1]}, {data.teamMembers[2]}</p>
	</footer>
</div>
