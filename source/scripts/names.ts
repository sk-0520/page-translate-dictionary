const baseName = 'ptd';
const baseAttr = 'data-' + baseName + '-';

export const ClassNames = {
	progress: baseName + '-progress',
	mark: baseName + '-marked',
}

export const Attributes = {
	translated: baseAttr + 'translated',
	textHead: baseAttr + 'translated-text-',
	value: baseAttr + 'translated-value',
	attributeHead: baseAttr + 'translated-attr-',
}
