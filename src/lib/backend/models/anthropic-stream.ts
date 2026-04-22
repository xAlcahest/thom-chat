export interface OpenAICompatChunk {
	id: string;
	choices: { delta: { content?: string; reasoning?: string } }[];
}

export async function* streamAnthropic(
	apiKey: string,
	model: string,
	messages: Array<{ role: string; content: string | Array<{ type: string; text?: string; image_url?: { url: string } }> }>,
	options: { temperature?: number; signal?: AbortSignal }
): AsyncGenerator<OpenAICompatChunk> {
	const systemMessages = messages.filter((m) => m.role === 'system');
	const nonSystemMessages = messages.filter((m) => m.role !== 'system');

	const systemText = systemMessages
		.map((m) => (typeof m.content === 'string' ? m.content : ''))
		.filter(Boolean)
		.join('\n\n');

	const anthropicMessages = nonSystemMessages.map((m) => {
		if (typeof m.content === 'string') {
			return { role: m.role, content: m.content };
		}
		return {
			role: m.role,
			content: m.content.map((c) => {
				if (c.type === 'text') return { type: 'text' as const, text: c.text || '' };
				if (c.type === 'image_url' && c.image_url) {
					return {
						type: 'image' as const,
						source: { type: 'url' as const, url: c.image_url.url },
					};
				}
				return c;
			}),
		};
	});

	const body: Record<string, unknown> = {
		model,
		messages: anthropicMessages,
		max_tokens: 16384,
		stream: true,
	};

	if (systemText) {
		body.system = systemText;
	}

	if (options.temperature !== undefined) {
		body.temperature = options.temperature;
	}

	const response = await fetch('https://api.anthropic.com/v1/messages', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'x-api-key': apiKey,
			'anthropic-version': '2023-06-01',
		},
		body: JSON.stringify(body),
		signal: options.signal,
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
	}

	if (!response.body) {
		throw new Error('No response body from Anthropic API');
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = '';
	let messageId = '';

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (!line.startsWith('data: ')) continue;
				const jsonStr = line.slice(6).trim();
				if (!jsonStr || jsonStr === '[DONE]') continue;

				let data: Record<string, any>;
				try {
					data = JSON.parse(jsonStr);
				} catch {
					continue;
				}

				if (data.type === 'message_start' && data.message?.id) {
					messageId = data.message.id;
				} else if (data.type === 'content_block_delta') {
					const delta = data.delta;
					if (delta?.type === 'text_delta' && delta.text) {
						yield {
							id: messageId,
							choices: [{ delta: { content: delta.text } }],
						};
					} else if (delta?.type === 'thinking_delta' && delta.thinking) {
						yield {
							id: messageId,
							choices: [{ delta: { reasoning: delta.thinking } }],
						};
					}
				} else if (data.type === 'error') {
					throw new Error(`Anthropic stream error: ${JSON.stringify(data.error)}`);
				}
			}
		}
	} finally {
		reader.releaseLock();
	}
}
