import { Provider } from '$lib/types';

export interface DirectModel {
	id: string;
	name: string;
	description: string;
	context_length: number;
	supports_images: boolean;
	supports_reasoning: boolean;
}

const openaiModels: DirectModel[] = [
	{
		id: 'gpt-4.1',
		name: 'GPT-4.1',
		description: 'Flagship model with strong reasoning and instruction following.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'gpt-4.1-mini',
		name: 'GPT-4.1 Mini',
		description: 'Fast and affordable version of GPT-4.1.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'gpt-4.1-nano',
		name: 'GPT-4.1 Nano',
		description: 'Fastest and cheapest GPT-4.1 variant for high-volume tasks.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'gpt-4o',
		name: 'GPT-4o',
		description: 'Multimodal model optimized for both text and vision tasks.',
		context_length: 128_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		description: 'Fast and cost-efficient multimodal model.',
		context_length: 128_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'o3',
		name: 'o3',
		description: 'Advanced reasoning model for complex problem solving.',
		context_length: 200_000,
		supports_images: true,
		supports_reasoning: true,
	},
	{
		id: 'o3-mini',
		name: 'o3 Mini',
		description: 'Efficient reasoning model balancing speed and capability.',
		context_length: 200_000,
		supports_images: false,
		supports_reasoning: true,
	},
	{
		id: 'o4-mini',
		name: 'o4 Mini',
		description: 'Latest compact reasoning model with strong performance.',
		context_length: 200_000,
		supports_images: true,
		supports_reasoning: true,
	},
];

const anthropicModels: DirectModel[] = [
	{
		id: 'claude-sonnet-4-6',
		name: 'Claude Sonnet 4.6',
		description: 'Balanced performance model with hybrid reasoning capabilities.',
		context_length: 200_000,
		supports_images: true,
		supports_reasoning: true,
	},
	{
		id: 'claude-opus-4-7',
		name: 'Claude Opus 4.7',
		description: 'Most capable Claude model for complex and nuanced tasks.',
		context_length: 200_000,
		supports_images: true,
		supports_reasoning: true,
	},
	{
		id: 'claude-haiku-4-5',
		name: 'Claude Haiku 4.5',
		description: 'Fast and affordable model for lightweight tasks.',
		context_length: 200_000,
		supports_images: true,
		supports_reasoning: false,
	},
];

const googleModels: DirectModel[] = [
	{
		id: 'gemini-2.5-pro',
		name: 'Gemini 2.5 Pro',
		description: 'Most capable Gemini model with strong reasoning and long context.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: true,
	},
	{
		id: 'gemini-2.5-flash',
		name: 'Gemini 2.5 Flash',
		description: 'Fast and efficient Gemini model with reasoning support.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: true,
	},
	{
		id: 'gemini-2.0-flash',
		name: 'Gemini 2.0 Flash',
		description: 'Fast multimodal model optimized for speed and throughput.',
		context_length: 1_000_000,
		supports_images: true,
		supports_reasoning: false,
	},
];

const perplexityModels: DirectModel[] = [
	{
		id: 'sonar',
		name: 'Sonar',
		description: 'Fast search-augmented language model for real-time answers.',
		context_length: 128_000,
		supports_images: false,
		supports_reasoning: false,
	},
	{
		id: 'sonar-pro',
		name: 'Sonar Pro',
		description: 'Advanced search model with deeper analysis and longer context.',
		context_length: 200_000,
		supports_images: false,
		supports_reasoning: false,
	},
	{
		id: 'sonar-reasoning-pro',
		name: 'Sonar Reasoning Pro',
		description: 'Advanced search model combining deep reasoning with long context.',
		context_length: 200_000,
		supports_images: false,
		supports_reasoning: true,
	},
];

const xaiModels: DirectModel[] = [
	{
		id: 'grok-3-beta',
		name: 'Grok 3',
		description: 'Most capable Grok model with strong multimodal understanding.',
		context_length: 131_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'grok-3-mini-beta',
		name: 'Grok 3 Mini',
		description: 'Compact Grok model with fast reasoning capabilities.',
		context_length: 131_000,
		supports_images: false,
		supports_reasoning: true,
	},
];

const deepseekModels: DirectModel[] = [
	{
		id: 'deepseek-chat',
		name: 'DeepSeek V3',
		description: 'General-purpose chat model with strong instruction following.',
		context_length: 64_000,
		supports_images: false,
		supports_reasoning: false,
	},
	{
		id: 'deepseek-reasoner',
		name: 'DeepSeek R1',
		description: 'Reasoning-focused model for complex analytical tasks.',
		context_length: 64_000,
		supports_images: false,
		supports_reasoning: true,
	},
];

const mistralModels: DirectModel[] = [
	{
		id: 'mistral-large-latest',
		name: 'Mistral Large',
		description: 'Most capable Mistral model for complex reasoning and vision.',
		context_length: 128_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'mistral-small-latest',
		name: 'Mistral Small',
		description: 'Fast and efficient model for everyday tasks.',
		context_length: 128_000,
		supports_images: true,
		supports_reasoning: false,
	},
	{
		id: 'codestral-latest',
		name: 'Codestral',
		description: 'Specialized model optimized for code generation and completion.',
		context_length: 256_000,
		supports_images: false,
		supports_reasoning: false,
	},
];

export function getDirectModels(provider: Provider): DirectModel[] {
	switch (provider) {
		case Provider.OpenAI: return openaiModels;
		case Provider.Anthropic: return anthropicModels;
		case Provider.Google: return googleModels;
		case Provider.Perplexity: return perplexityModels;
		case Provider.xAI: return xaiModels;
		case Provider.DeepSeek: return deepseekModels;
		case Provider.Mistral: return mistralModels;
		default: return [];
	}
}

export const DIRECT_PROVIDERS = [
	Provider.OpenAI, Provider.Anthropic, Provider.Google,
	Provider.Perplexity, Provider.xAI, Provider.DeepSeek, Provider.Mistral,
] as const;
