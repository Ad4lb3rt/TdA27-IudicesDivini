<script lang="ts">
	import { enhance } from "$app/forms";
	import type { Stop } from "./api";

	interface Props {
		products: Stop[];
		onEdit: (product: Stop) => void;
	}

	let { products: stops, onEdit }: Props = $props();
</script>

<!-- {#if stops.length === 0}
	<p>No products.</p>
{:else}
	<table>
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Price</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each stops as p (p.id)}
				<tr>
					<td>{p.id}</td>
					<td>{p.name}</td>
					<td>{p.cost}</td>
					<td class="actions">
						<button onclick={() => onEdit(p)}>Edit</button>
						<form
							method="POST"
							action="?/delete"
							use:enhance
							style="display: inline;"
						>
							<input type="hidden" name="id" value={p.id} />
							<button type="submit">Delete</button>
						</form>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/if}
 -->
