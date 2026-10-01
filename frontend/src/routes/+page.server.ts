import * as api from '$lib/api';
import type { PageServerLoad, Actions } from './$types';
import { type Stop } from "$lib/api";

export const load: PageServerLoad = async ({ fetch }) => {
	const status: string = await api.getHealth(fetch);
	const stops: Stop[] = await api.getStops(fetch);
	const teamName: string = await api.getTeamName(fetch);
	const teamMembers: string[] = await api.getTeamMembers(fetch);
	return {
		stops,
		status,
		teamName,
		teamMembers
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const name = data.get('name') as string;

		const rawImage = data.get('image_url');
		const image_url = rawImage ? String(rawImage) : null;

		const wheelchair_accessible = data.get('wheelchair_accessible') === 'on';
		const has_shelter = data.get('has_shelter') === 'on';
		const has_ticket_machine = data.get('has_ticket_machine') === 'on';

		if (!name) return { success: false, error: 'Invalid data' };

		await api.createStop({
			name,
			image_url,
			wheelchair_accessible,
			has_shelter,
			has_ticket_machine
		}, fetch);

		return { success: true };
	},
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const name = data.get('name') as string;

		const rawImage = data.get('image_url');
		const image_url = rawImage ? String(rawImage) : null;

		const wheelchair_accessible = data.get('wheelchair_accessible') === 'on';
		const has_shelter = data.get('has_shelter') === 'on';
		const has_ticket_machine = data.get('has_ticket_machine') === 'on';

		if (!id || !name) return { success: false, error: 'Invalid data' };

		await api.updateStop(id, {
			name,
			image_url,
			wheelchair_accessible,
			has_shelter,
			has_ticket_machine
		}, fetch);
		return { success: true };
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) return { success: false, error: 'Invalid ID' };

		await api.deleteStop(id, fetch);
		return { success: true };
	}
};
