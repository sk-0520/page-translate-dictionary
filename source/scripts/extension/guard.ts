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

export function isSiteHeadConfiguration(obj: unknown): obj is config.SiteHeadConfiguration {
	return types.isObject(obj)
		&& types.hasString(obj, 'id')
		&& types.hasBoolean(obj, 'isEnabled')
		&& types.hasString(obj, 'updateUrl')
		&& types.hasString(obj, 'updatedTimestamp')
		&& types.hasString(obj, 'name')
		&& types.hasString(obj, 'version')
		&& types.hasArray(obj, 'hosts') && types.isStringArray(obj.hosts)
		&& types.hasNumber(obj, 'priority')
		&& types.hasString(obj, 'language')
		;
}
