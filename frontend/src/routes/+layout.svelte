<script lang="ts">
	import '../app.css';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<div class="page">
    <nav class="navbar">
        <a href="/" class="logo">
            <img src="logo_black.svg" alt="Logo">
        </a>
        <div class="navbar-links">
            <a href="/">Home</a>
            <a href="/stops">Stops</a>
        </div>
    </nav>

	<main class="page-content">
		{@render children()}
	</main>

	<footer>
		<p>Built with ❤️ by <p2 class="team-name">{data.teamName}</p2> - {data.teamMembers[0]}, {data.teamMembers[1]}, {data.teamMembers[2]}</p>
	</footer>
</div>
