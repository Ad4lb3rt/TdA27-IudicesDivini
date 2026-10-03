<script lang="ts">
	import type { PageData } from './$types';
	import { resolveImageUrl } from '$lib/api';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Stops</h1>

	{#if data.stops.length === 0}
		<p>No stops found.</p>
	{:else}
		<ul>
			{#each data.stops as stop (stop.id)}
				<li>
					<a href="/stops/{stop.id}">
						{#if stop.image_url}
							<img src={resolveImageUrl(stop.image_url)} alt={stop.name} />
						{/if}
						<span>{stop.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
