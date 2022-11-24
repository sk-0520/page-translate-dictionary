import * as types from '../core/types';
import * as config from './config';

export function isTranslateConfiguration(obj: unknown): obj is config.TranslateConfiguration {
	type TYPE = config.TranslateConfiguration;

	return types.isObject(obj)
		&& types.hasBoolean(obj, types.nameof<TYPE>('markReplacedElement'))
		;
}

export function isApplicationConfiguration(obj: unknown): obj is config.ApplicationConfiguration {
	type TYPE = config.ApplicationConfiguration;

	return types.isObject(obj)
		&& types.hasObject(obj, types.nameof<TYPE>('translate'))
		&& isTranslateConfiguration(obj.translate)
		;
}

export function isSiteHeadConfiguration(obj: unknown): obj is config.SiteHeadConfiguration {
	type TYPE = config.SiteHeadConfiguration;

	return types.isObject(obj)
		&& types.hasString(obj, types.nameof<TYPE>('id'))
		&& types.hasBoolean(obj, types.nameof<TYPE>('isEnabled'))
		&& types.hasString(obj, types.nameof<TYPE>('updateUrl'))
		&& types.hasString(obj, types.nameof<TYPE>('updatedTimestamp'))
		&& types.hasString(obj, types.nameof<TYPE>('name'))
		&& types.hasString(obj, types.nameof<TYPE>('version'))
		&& types.hasArray(obj, types.nameof<TYPE>('hosts')) && types.isStringArray(obj.hosts)
		&& types.hasNumber(obj, types.nameof<TYPE>('priority'))
		&& types.hasString(obj, types.nameof<TYPE>('language'))
		;
}
