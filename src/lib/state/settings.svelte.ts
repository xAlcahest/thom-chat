import { createPersistedObj } from '$lib/spells/persisted-obj.svelte';

export const settings = createPersistedObj('settings', {
	modelId: undefined as string | undefined,
	provider: 'openrouter' as string,
	webSearchEnabled: false,
	reasoningEffort: 'low' as 'low' | 'medium' | 'high' | 'max' | 'xhigh',
});
