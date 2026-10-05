<script lang="ts">
	import type { PageData } from './$types';
	import { resolveImageUrl } from '$lib/api';

	let { data }: { data: PageData } = $props();

	const colors = ["#F5F5F5", "#91F5AD"]
	let filterChecked = $state([false, false, false])
	let filterColor = $derived([colors[+filterChecked[0]],colors[+filterChecked[1]],colors[+filterChecked[2]]])

	function ResetFilters()
	{
	    for(var i = 0; i < 2; i++)
		{
			filterChecked[i] = false;
		}
	}
</script>

<div class="stops">
	<h1>Stops</h1>
	<div class="search-row">
	    <div class="search-bar">
			<input type="text" maxlength="255" placeholder="Search..." onkeydown={(e) => r}>
		</div>
		<div class="filters">
		    <button type="button" style="background-color: {filterColor[0]}; --checked: {filterChecked[0]}" class="filter" onclick={() => filterChecked[0] = !filterChecked[0]}>Wheelchair accessible</button>
			<button type="button" style="background-color: {filterColor[1]}; --checked: {filterChecked[1]}" class="filter" onclick={() => filterChecked[1] = !filterChecked[1]}>Has shelter</button>
			<button type="button" style="background-color: {filterColor[2]}; --checked: {filterChecked[2]}" class="filter" onclick={() => filterChecked[2] = !filterChecked[2]}>Has ticket machine</button>
		</div>
	</div>

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
