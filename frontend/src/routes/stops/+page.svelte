<script lang="ts">
	import { goto } from "$app/navigation";
	import { onDestroy } from "svelte";
	import type { PageData } from "./$types";
	import { resolveImageUrl } from "$lib/api";

	let { data }: { data: PageData } = $props();

	const SEARCH_DEBOUNCE_MS = 500;

	let inputValue = $state("");
	let wheelchairChecked = $state(false);
	let shelterChecked = $state(false);
	let ticketMachineChecked = $state(false);

	let debounceTimer: ReturnType<typeof setTimeout> | undefined;
	let lastAppliedQuery = "";

	function currentQuery(): string {
		const params = new URLSearchParams();
		const trimmed = inputValue.trim();
		if (trimmed !== "") {
			params.set("name", trimmed);
			return params.toString();
		}
		if (wheelchairChecked) {
			params.set("wheelchair_accessible", "true");
		}
		if (shelterChecked) {
			params.set("has_shelter", "true");
		}
		if (ticketMachineChecked) {
			params.set("has_ticket_machine", "true");
		}
		return params.toString();
	}

	function serverQuery(): string {
		const params = new URLSearchParams();
		const name = (data.name ?? "").trim();
		if (name !== "") {
			params.set("name", name);
			return params.toString();
		}
		if (data.filters?.wheelchair_accessible) {
			params.set("wheelchair_accessible", "true");
		}
		if (data.filters?.has_shelter) {
			params.set("has_shelter", "true");
		}
		if (data.filters?.has_ticket_machine) {
			params.set("has_ticket_machine", "true");
		}
		return params.toString();
	}

	$effect(() => {
		if (serverQuery() !== lastAppliedQuery) {
			lastAppliedQuery = serverQuery();
			inputValue = data.name ?? "";
			wheelchairChecked = data.filters?.wheelchair_accessible ?? false;
			shelterChecked = data.filters?.has_shelter ?? false;
			ticketMachineChecked = data.filters?.has_ticket_machine ?? false;
		}
	});

	onDestroy(() => clearTimeout(debounceTimer));

	function applySearch() {
		lastAppliedQuery = currentQuery();
		let url = "/stops";
		if (lastAppliedQuery !== "") {
			url = `/stops?${lastAppliedQuery}`;
		}
		const current = window.location.pathname + window.location.search;
		if (url !== current) {
			goto(url, { keepFocus: true, noScroll: true, replaceState: true });
		}
	}

	function scheduleSearch() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(applySearch, SEARCH_DEBOUNCE_MS);
	}

	function onSearchInput() {
		wheelchairChecked = false;
		shelterChecked = false;
		ticketMachineChecked = false;
		scheduleSearch();
	}

	function onWheelchairClick() {
		wheelchairChecked = !wheelchairChecked;
		inputValue = "";
		scheduleSearch();
	}

	function onShelterClick() {
		shelterChecked = !shelterChecked;
		inputValue = "";
		scheduleSearch();
	}

	function onTicketMachineClick() {
		ticketMachineChecked = !ticketMachineChecked;
		inputValue = "";
		scheduleSearch();
	}
</script>

<div class="stops">
	<h1>Stops</h1>
	<div class="search-row">
		<div class="search-bar">
			<input
				type="text"
				maxlength="255"
				placeholder="Search..."
				bind:value={inputValue}
				oninput={onSearchInput}
			/>
		</div>
		<div class="filters">
			<button
				type="button"
				aria-pressed={wheelchairChecked}
				style="background-color: {wheelchairChecked
					? '#91F5AD'
					: '#F5F5F5'}; --checked: {wheelchairChecked}"
				class="filter"
				onclick={onWheelchairClick}>Wheelchair accessible</button
			>
			<button
				type="button"
				aria-pressed={shelterChecked}
				style="background-color: {shelterChecked
					? '#91F5AD'
					: '#F5F5F5'}; --checked: {shelterChecked}"
				class="filter"
				onclick={onShelterClick}>Has shelter</button
			>
			<button
				type="button"
				aria-pressed={ticketMachineChecked}
				style="background-color: {ticketMachineChecked
					? '#91F5AD'
					: '#F5F5F5'}; --checked: {ticketMachineChecked}"
				class="filter"
				onclick={onTicketMachineClick}>Has ticket machine</button
			>
		</div>
	</div>

	{#if data.stops.length === 0}
	<div class="error-container">
	    <p class="error-message">No stops found.</p>
	</div>
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
