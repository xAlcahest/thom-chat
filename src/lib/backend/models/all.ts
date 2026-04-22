import { Provider } from '$lib/types';
import type { DirectModel } from './direct';
import { type OpenRouterModel } from './open-router';

export type ProviderModelMap = {
	[Provider.OpenRouter]: OpenRouterModel;
	[Provider.HuggingFace]: never;
	[Provider.OpenAI]: DirectModel;
	[Provider.Anthropic]: DirectModel;
	[Provider.Google]: DirectModel;
	[Provider.Perplexity]: DirectModel;
	[Provider.xAI]: DirectModel;
	[Provider.DeepSeek]: DirectModel;
	[Provider.Mistral]: DirectModel;
};
