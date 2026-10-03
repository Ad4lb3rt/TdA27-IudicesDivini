import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getStop } from '$lib/api';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const stop = await getStop(Number(params.slug), fetch);
		return { stop };
	} catch (e) {
		throw error(404, (e as Error).message ?? 'Stop does not exist');
	}
};
