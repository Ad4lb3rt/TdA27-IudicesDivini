<script lang="ts">
	import type { PageData } from './$types';
	import { type Product } from '$lib/api';
	import ProductForm from "$lib/ProductForm.svelte";
	import ProductTable from "$lib/ProductTable.svelte";

	let { data }: { data: PageData } = $props();

	let editingProduct = $state<Product | null>(null);

	function handleSuccess() {
		editingProduct = null;
	}
</script>

<div>
	
	<h1>Think different Academy</h1>
	<h2>School Buffet</h2>
	
	<ProductForm
		initial={editingProduct}
		onCancel={editingProduct ? () => (editingProduct = null) : undefined}
		onSuccess={handleSuccess}
	/>

	<ProductTable
		products={data.products}
		onEdit={(p) => (editingProduct = p)}
	/>
	<br><p>Status: {(data.status).toUpperCase()}</p>
</div>
