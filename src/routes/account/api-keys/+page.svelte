<script lang="ts">
	import { Provider, type ProviderMeta } from '$lib/types';
	import ProviderCard from './provider-card.svelte';

	const displayProviders = [
		Provider.OpenRouter,
		Provider.OpenAI,
		Provider.Anthropic,
		Provider.Google,
		Provider.Perplexity,
		Provider.xAI,
		Provider.DeepSeek,
		Provider.Mistral,
	];

	const providersMeta: Record<string, ProviderMeta> = {
		[Provider.OpenRouter]: {
			title: 'OpenRouter',
			link: 'https://openrouter.ai/settings/keys',
			description: 'Access to 400+ models from all providers through a single key.',
			placeholder: 'sk-or-...',
		},
		[Provider.OpenAI]: {
			title: 'OpenAI',
			link: 'https://platform.openai.com/api-keys',
			description: 'Direct access to GPT-4.1, o3, o4-mini and more.',
			placeholder: 'sk-...',
		},
		[Provider.Anthropic]: {
			title: 'Anthropic',
			link: 'https://console.anthropic.com/settings/keys',
			description: 'Direct access to Claude Opus 4, Sonnet 4, Haiku 3.5.',
			placeholder: 'sk-ant-...',
		},
		[Provider.Google]: {
			title: 'Google AI',
			link: 'https://aistudio.google.com/app/apikey',
			description: 'Direct access to Gemini 2.5 Pro, Flash and more.',
			placeholder: 'AI...',
		},
		[Provider.Perplexity]: {
			title: 'Perplexity',
			link: 'https://www.perplexity.ai/settings/api',
			description: 'Sonar models with built-in web search.',
			placeholder: 'pplx-...',
		},
		[Provider.xAI]: {
			title: 'xAI',
			link: 'https://console.x.ai/',
			description: 'Direct access to Grok 3 and Grok 3 Mini.',
			placeholder: 'xai-...',
		},
		[Provider.DeepSeek]: {
			title: 'DeepSeek',
			link: 'https://platform.deepseek.com/api_keys',
			description: 'Direct access to DeepSeek V3 and R1.',
			placeholder: 'sk-...',
		},
		[Provider.Mistral]: {
			title: 'Mistral',
			link: 'https://console.mistral.ai/api-keys/',
			description: 'Direct access to Mistral Large, Small, and Codestral.',
			placeholder: '',
		},
	};
</script>

<svelte:head>
	<title>API Keys | thom.chat</title>
</svelte:head>

<div>
	<h1 class="text-2xl font-bold">API Keys</h1>
	<h2 class="text-muted-foreground mt-2 text-sm">
		Bring your own API keys for select models. Messages sent using your API keys will not count
		towards your monthly limits.
	</h2>
</div>

<div class="mt-8 flex flex-col gap-4">
	{#each displayProviders as provider (provider)}
		{@const meta = providersMeta[provider]}
		{#if meta}
			<ProviderCard {provider} {meta} />
		{/if}
	{/each}
</div>
