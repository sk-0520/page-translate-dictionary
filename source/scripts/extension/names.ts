const baseName = 'ptd';
const baseAttr = 'data-' + baseName + '-';

export const ClassNames = {
	progress: baseName + '-progress',
	mark: baseName + '-marked',
} as const;

export const Attributes = {
	translated: baseAttr + 'translated',
	translateSettings: baseAttr + 'setting',
	textHead: baseAttr + 'translated-text-',
	attributeHead: baseAttr + 'translated-attr-',
} as const;
