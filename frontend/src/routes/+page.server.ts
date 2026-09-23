import * as api from '$lib/api';
import type { PageServerLoad, Actions } from './$types';
import { type Product } from "$lib/api";

export const load: PageServerLoad = async ({ fetch }) => {
	const status: string = await api.getHealth(fetch);
	const products: Product[] = await api.getProducts(fetch);
	const teamName: string = await api.getTeamName(fetch);
	const teamMembers: string[] = await api.getTeamMembers(fetch);
	return {
		products,
		status,
		teamName,
		teamMembers
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const cost = Number(data.get('cost'));

		if (!name || isNaN(cost)) return { success: false, error: 'Invalid data' };

		await api.createProduct({ name, cost }, fetch);
		return { success: true };
	},
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const name = data.get('name') as string;
		const cost = Number(data.get('cost'));

		if (!id || !name || isNaN(cost)) return { success: false, error: 'Invalid data' };

		await api.updateProduct(id, { id, name, cost }, fetch);
		return { success: true };
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) return { success: false, error: 'Invalid ID' };

		await api.deleteProduct(id, fetch);
		return { success: true };
	}
};
