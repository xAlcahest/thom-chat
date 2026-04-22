import { DIRECT_PROVIDERS, getDirectModels } from '$lib/backend/models/direct';
import { getOpenRouterModels, type OpenRouterModel } from '$lib/backend/models/open-router';
import { Provider } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const [session, openRouterModels] = await Promise.all([locals.auth(), getOpenRouterModels()]);

	const models: Record<string, unknown[]> = {
		[Provider.OpenRouter]: openRouterModels.unwrapOr([] as OpenRouterModel[]),
	};

	for (const provider of DIRECT_PROVIDERS) {
		models[provider] = getDirectModels(provider);
	}

	return { session, models };
};

export const ssr = true;
