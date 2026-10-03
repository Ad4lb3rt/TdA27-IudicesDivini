<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<div>
	<h1>Think different Academy</h1>
	<p>Status: {(data.status).toUpperCase()}</p>
</div>
