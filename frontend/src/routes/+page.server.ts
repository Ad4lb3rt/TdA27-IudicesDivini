import { getProducts, createProduct, updateProduct, deleteProduct, getHealth } from '$lib/api';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const status = await getHealth(fetch);
	const products = await getProducts(fetch);
	return {
    products,
    status
	};
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const data = await request.formData();
		const name = data.get('name') as string;
		const cost = Number(data.get('cost'));

		if (!name || isNaN(cost)) return { success: false, error: 'Invalid data' };

		await createProduct({ name, cost }, fetch);
		return { success: true };
	},
	update: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));
		const name = data.get('name') as string;
		const cost = Number(data.get('cost'));

		if (!id || !name || isNaN(cost)) return { success: false, error: 'Invalid data' };

		await updateProduct(id, { id, name, cost }, fetch);
		return { success: true };
	},
	delete: async ({ request, fetch }) => {
		const data = await request.formData();
		const id = Number(data.get('id'));

		if (!id) return { success: false, error: 'Invalid ID' };

		await deleteProduct(id, fetch);
		return { success: true };
	}
};
