import * as api from '$lib/api';
import type { LayoutServerLoad, PageServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ fetch }) => {
  const teamName: string = await api.getTeamName(fetch);
  const teamMembers: string[] = await api.getTeamMembers(fetch);
	return {
    teamName,
    teamMembers
	};
};
