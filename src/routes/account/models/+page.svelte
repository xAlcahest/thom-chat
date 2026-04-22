<script lang="ts">
	import { api } from '$lib/backend/convex/_generated/api';
	import { useCachedQuery } from '$lib/cache/cached-query.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Search } from '$lib/components/ui/search';
	import { models } from '$lib/state/models.svelte';
	import { session } from '$lib/state/session.svelte';
	import { Provider } from '$lib/types.js';
	import { DIRECT_PROVIDERS } from '$lib/backend/models/direct';
	import { fuzzysearch } from '$lib/utils/fuzzy-search';
	import { cn } from '$lib/utils/utils';
	import { Toggle } from 'melt/builders';
	import PlusIcon from '~icons/lucide/plus';
	import XIcon from '~icons/lucide/x';
	import ModelCard from './model-card.svelte';
	import { supportsImages, supportsReasoning } from '$lib/utils/model-capabilities';

	const providerLabels: Record<string, { title: string; description: string }> = {
		[Provider.OpenRouter]: { title: 'OpenRouter', description: 'Easy access to over 400 models.' },
		[Provider.OpenAI]: { title: 'OpenAI', description: 'GPT-4.1, o3, o4-mini and more.' },
		[Provider.Anthropic]: {
			title: 'Anthropic',
			description: 'Claude Opus 4, Sonnet 4, Haiku 3.5.',
		},
		[Provider.Google]: {
			title: 'Google AI',
			description: 'Gemini 2.5 Pro, Flash and more.',
		},
		[Provider.Perplexity]: {
			title: 'Perplexity',
			description: 'Sonar models with built-in web search.',
		},
		[Provider.xAI]: { title: 'xAI', description: 'Grok 3 and Grok 3 Mini.' },
		[Provider.DeepSeek]: { title: 'DeepSeek', description: 'DeepSeek V3 and R1.' },
		[Provider.Mistral]: { title: 'Mistral', description: 'Mistral Large, Small, and Codestral.' },
	};

	const allDisplayProviders = [Provider.OpenRouter, ...DIRECT_PROVIDERS];

	const keyQueries = Object.fromEntries(
		allDisplayProviders.map((p) => [
			p,
			useCachedQuery(api.user_keys.get, {
				provider: p,
				session_token: session.current?.session.token ?? '',
			}),
		])
	);

	function hasKey(provider: string): boolean {
		const q = keyQueries[provider];
		return q?.data !== undefined && q?.data !== '';
	}

	let search = $state('');

	const reasoningModelsToggle = new Toggle({ value: false });
	const imageModelsToggle = new Toggle({ value: false });

	let initiallyEnabled = $state<string[]>([]);
	$effect(() => {
		if (Object.keys(models.enabled).length && initiallyEnabled.length === 0) {
			const enabled: string[] = [];
			for (const p of allDisplayProviders) {
				try {
					enabled.push(
						...models
							.from(p)
							.filter((m: any) => m.enabled)
							.map((m: any) => m.id)
					);
				} catch {
					// provider may not have models loaded
				}
			}
			initiallyEnabled = enabled;
		}
	});

	function getProviderModels(provider: string) {
		try {
			const allModels = models.from(provider as Provider);
			const filtered = allModels.filter((m: any) => {
				if (reasoningModelsToggle.value && !supportsReasoning(m)) return false;
				if (imageModelsToggle.value && !supportsImages(m)) return false;
				return true;
			});

			return fuzzysearch({
				haystack: filtered,
				needle: search,
				property: 'name' in filtered[0]! ? 'name' : 'id',
			}).sort((a: any, b: any) => {
				const aEnabled = initiallyEnabled.includes(a.id);
				const bEnabled = initiallyEnabled.includes(b.id);
				if (aEnabled && !bEnabled) return -1;
				if (!aEnabled && bEnabled) return 1;
				return 0;
			});
		} catch {
			return [];
		}
	}
</script>

<svelte:head>
	<title>Models | thom.chat</title>
</svelte:head>

<h1 class="text-2xl font-bold">Available Models</h1>
<h2 class="text-muted-foreground mt-2 text-sm">
	Choose which models appear in your model selector. This won't affect existing conversations.
</h2>

<div class="mt-4 flex flex-col gap-2">
	<Search bind:value={search} placeholder="Search models" />
	<div class="flex place-items-center gap-2">
		<button
			{...reasoningModelsToggle.trigger}
			aria-label="Reasoning Models"
			class="group text-primary-foreground bg-primary aria-[pressed=false]:border-border border-primary aria-[pressed=false]:bg-background flex place-items-center gap-1 rounded-full border px-2 py-1 text-xs transition-all"
		>
			Reasoning
			<XIcon class="inline size-3 group-aria-[pressed=false]:hidden" />
			<PlusIcon class="inline size-3 group-aria-[pressed=true]:hidden" />
		</button>
		<button
			{...imageModelsToggle.trigger}
			aria-label="Image Models"
			class="group text-primary-foreground bg-primary aria-[pressed=false]:border-border border-primary aria-[pressed=false]:bg-background flex place-items-center gap-1 rounded-full border px-2 py-1 text-xs transition-all"
		>
			Images
			<XIcon class="inline size-3 group-aria-[pressed=false]:hidden" />
			<PlusIcon class="inline size-3 group-aria-[pressed=true]:hidden" />
		</button>
	</div>
</div>

{#each allDisplayProviders as provider (provider)}
	{@const providerModels = getProviderModels(provider)}
	{@const label = providerLabels[provider]}
	{@const providerHasKey = hasKey(provider)}

	{#if providerModels.length > 0 && label}
		<div class="mt-4 flex flex-col gap-4">
			<div>
				<h3 class="text-lg font-bold">{label.title}</h3>
				<p class="text-muted-foreground text-sm">{label.description}</p>
			</div>
			<div class="relative">
				<div
					class={cn('flex flex-col gap-4 overflow-hidden', {
						'pointer-events-none max-h-96 mask-b-from-0% mask-b-to-80%': !providerHasKey,
					})}
				>
					{#each providerModels as model (model.id)}
						<ModelCard
							{provider}
							{model}
							enabled={model.enabled}
							disabled={!providerHasKey}
						/>
					{/each}
				</div>
				{#if !providerHasKey}
					<div
						class="absolute bottom-10 left-0 z-10 flex w-full place-items-center justify-center gap-2"
					>
						<Button href="/account/api-keys#{provider}" class="w-fit">Add API Key</Button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
{/each}
