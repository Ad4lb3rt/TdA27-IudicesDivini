<script lang="ts">
	import type { PageData } from './$types';
	import { resolveImageUrl } from '$lib/api';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<a href="/stops">← Back to stops</a>
	<h1>{data.stop.name}</h1>
	{#if data.stop.image_url}
		<img src={resolveImageUrl(data.stop.image_url)} alt={data.stop.name} />
	{/if}
	<ul>
		<li>Wheelchair accessible: {data.stop.wheelchair_accessible ? 'Yes' : 'No'}</li>
		<li>Shelter: {data.stop.has_shelter ? 'Yes' : 'No'}</li>
		<li>Ticket machine: {data.stop.has_ticket_machine ? 'Yes' : 'No'}</li>
	</ul>
</div>
