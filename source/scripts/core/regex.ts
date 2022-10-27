/**
 * 正規表現エスケープ。
 *
 * @param source
 * @returns
 */
export function escape(source: string) {
	return source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
