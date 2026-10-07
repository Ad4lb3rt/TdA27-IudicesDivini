<script lang="ts">
	import type { PageData } from './$types';
	import { resolveImageUrl } from '$lib/api';

	let { data }: { data: PageData } = $props();
</script>

<div class="stop-detail">
	<a class="stop-back" href="/stops">Back to stops</a>
	<div class="stop-detail-card">
		{#if data.stop.image_url}
			<img
				class="stop-detail-image"
				src={resolveImageUrl(data.stop.image_url)}
				alt={data.stop.name}
			/>
		{/if}
		<ul class="stop-detail-info">
		    <h1 class="stop-detail-name">{data.stop.name}</h1>
			<li>Wheelchair accessible: {data.stop.wheelchair_accessible ? 'Yes' : 'No'}</li>
			<li>Shelter: {data.stop.has_shelter ? 'Yes' : 'No'}</li>
			<li>Ticket machine: {data.stop.has_ticket_machine ? 'Yes' : 'No'}</li>
		</ul>
	</div>
</div>
