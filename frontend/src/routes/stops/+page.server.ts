import type { PageServerLoad } from './$types';
import { getStops, getStopByName, searchStopsByFilters } from '$lib/api';

export const load: PageServerLoad = async ({ fetch, url }) => {
	const name = (url.searchParams.get('name') ?? '').trim().slice(0, 255);

	if (name) {
		const stops = await getStopByName(name, fetch);
		return {
			stops,
			name,
			filters: { wheelchair_accessible: false, has_shelter: false, has_ticket_machine: false }
		};
	}

	const filters = {
		wheelchair_accessible: url.searchParams.get('wheelchair_accessible') === 'true',
		has_shelter: url.searchParams.get('has_shelter') === 'true',
		has_ticket_machine: url.searchParams.get('has_ticket_machine') === 'true'
	};

	if (filters.wheelchair_accessible || filters.has_shelter || filters.has_ticket_machine) {
		const stops = await searchStopsByFilters(filters, fetch);
		return { stops, name: '', filters };
	}

	const stops = await getStops(fetch);
	return {
		stops,
		name: '',
		filters
	};
};
