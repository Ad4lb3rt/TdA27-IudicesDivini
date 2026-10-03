import type { PageServerLoad } from './$types';
import { getStops } from '$lib/api';

export const load: PageServerLoad = async ({ fetch }) => {
	const stops = await getStops(fetch);
	return {
		stops
	};
};
