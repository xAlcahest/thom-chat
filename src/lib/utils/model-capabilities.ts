import type { DirectModel } from '$lib/backend/models/direct';
import type { OpenRouterModel } from '$lib/backend/models/open-router';

type AnyModel = OpenRouterModel | DirectModel;

function isDirectModel(model: AnyModel): model is DirectModel {
	return 'supports_images' in model;
}

export function supportsImages(model: AnyModel): boolean {
	if (isDirectModel(model)) return model.supports_images;
	return model.architecture.input_modalities.includes('image');
}

export function supportsReasoning(model: AnyModel): boolean {
	if (isDirectModel(model)) return model.supports_reasoning;
	return model.supported_parameters.includes('reasoning');
}

export function getImageSupportedModels<T extends AnyModel>(models: T[]): T[] {
	return models.filter(supportsImages);
}
