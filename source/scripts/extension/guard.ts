import * as types from '../core/types';
import * as config from './config';

export function isTranslateConfiguration(obj: unknown): obj is config.TranslateConfiguration {
	return types.isObject(obj)
		&& types.hasBoolean(obj, 'markReplacedElement')
		;
}

export function isApplicationConfiguration(obj: unknown): obj is config.ApplicationConfiguration {
	return types.isObject(obj)
		&& types.hasObject(obj, 'translate')
		&& isTranslateConfiguration(obj.translate)
		;
}

export function isSiteHeadConfiguration(obj: any): obj is config.SiteHeadConfiguration {
	return obj
		&& 'id' in obj && typeof obj.id === 'string'
		&& types.hasBoolean(obj, 'isEnabled')
		&& 'updateUrl' in obj && typeof obj.updateUrl === 'string'
		&& 'updatedTimestamp' in obj && typeof obj.updatedTimestamp === 'string'
		&& 'name' in obj && typeof obj.name === 'string'
		&& 'version' in obj && typeof obj.version === 'string'
		&& 'hosts' in obj && Array.isArray(obj.hosts)
		&& 'priority' in obj && typeof obj.priority === 'number'
		&& 'language' in obj && typeof obj.language === 'string'
		;
}
