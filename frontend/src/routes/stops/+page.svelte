<script lang="ts">
	import type { PageData } from './$types';
	import { resolveImageUrl } from '$lib/api';

	let { data }: { data: PageData } = $props();
</script>

<div class="stops">
	<h1>Stops</h1>

	{#if data.stops.length === 0}
		<p>No stops found.</p>
	{:else}
		<ul class="stops-list">
			{#each data.stops as stop (stop.id)}
				<li class="stop-card">
					<a href="/stops/{stop.id}">
						{#if stop.image_url}
							<img
								class="stop-image"
								src={resolveImageUrl(stop.image_url)}
								alt={stop.name}
								loading="lazy"
							/>
						{/if}
						<span class="stop-name">{stop.name}</span>
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</div>
