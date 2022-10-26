
/**
 * 非同期待機
 *
 * @param msec 停止時間(ミリ秒)
 */
export function sleepAsync(msec: number): Promise<void> {
	return new Promise((resolve, _) => {
		setTimeout(() => {
			resolve()
		}, msec);
	});
}
