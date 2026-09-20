<script lang="ts">
	import { enhance } from '$app/forms';
	import type { Product } from './api';

	interface Props {
		initial?: Product | null;
		onCancel?: (() => void) | null;
		onSuccess?: () => void;
	}

	let { initial = null, onCancel = null, onSuccess }: Props = $props();
</script>

{#key initial?.id || "new"}
	<form
		method="POST"
		action={initial ? "?/update" : "?/create"}
		use:enhance={() => {
			return async ({ update }) => {
				await update();
				if (onSuccess) onSuccess();
			};
		}}
	>
		{#if initial}
			<input type="hidden" name="id" value={initial.id} />
		{/if}
		<label>
			Name
			<input name="name" value={initial?.name || ""} required />
		</label>
		<label>
			Price
			<input name="cost" type="number" value={initial?.cost || ""} required />
		</label>
		<button type="submit">{initial ? "Save" : "Add"}</button>
		{#if onCancel}
			<button type="button" onclick={onCancel}>Zrušit</button>
		{/if}
	</form>
{/key}
