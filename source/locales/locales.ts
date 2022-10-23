import * as locale from './locale';
import ja from './ja';

export function gets(): { [name: string]: locale.MessageMap } {
	return {
		'ja': ja,
	};
}
