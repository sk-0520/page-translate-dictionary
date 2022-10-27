/**
 * 時間を扱う。
 *
 * 細かいのは時間できたときに、うん。
 */
export default class TimeSpan {

	/**
	 * 生成。
	 *
	 * @param _ticks ミリ秒。
	 */
	private constructor(private _ticks: number) {
	}

	//#region property

	public get ticks(): number {
		return this._ticks;
	}

	public get totalMilliseconds(): number {
		return this._ticks;
	}

	public get totalSeconds(): number {
		return this._ticks / 1000;
	}

	public get totalMinutes(): number {
		return this._ticks / 1000 / 60;
	}

	public get totalHours(): number {
		return this._ticks / 1000 / 60 / 60;
	}

	public get totalDays(): number {
		return this._ticks / 1000 / 60 / 60 / 24;
	}

	//#endregion

	//#region function

	public static fromMilliseconds(milliSeconds: number): TimeSpan {
		return new TimeSpan(milliSeconds);
	}

	public static fromSeconds(seconds: number): TimeSpan {
		return new TimeSpan(seconds * 1000);
	}

	public static fromMinutes(minutes: number): TimeSpan {
		return new TimeSpan(minutes * 60 * 1000);
	}

	public static fromHours(hours: number): TimeSpan {
		return new TimeSpan(hours * 60 * 60 * 1000);
	}

	public static fromDays(hours: number): TimeSpan {
		return new TimeSpan(hours * 24 * 60 * 60 * 1000);
	}

	public equals(timeSpan: TimeSpan): boolean {
		return timeSpan.ticks === this.ticks;
	}

	public compare(timeSpan: TimeSpan): number {
		return this.ticks - timeSpan.ticks;
	}

	//#endregion
}
