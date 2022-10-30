/**
 * 時間を扱う。
 *
 * 細かいのは時間できたときに、うん。
 */
export class TimeSpan {

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

export enum DayOfWeek {
	Sunday = 0,
	Monday,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
}

export class DateTime {

	/**
	 * 生成。
	 *
	 * @param _timestamp タイムスタンプ。
	 */
	private constructor(private readonly _timestamp: Date, private readonly _isUtc: boolean) {
	}

	//#region property

	public get isUtc(): boolean {
		return this._isUtc;
	}

	public get year(): number {
		return this._timestamp.getFullYear()
			;
	}

	public get month(): number {
		const rawMonth = this._timestamp.getMonth()
			;

		return rawMonth + 1;
	}

	public get day(): number {
		return this._timestamp.getDate()
			;
	}

	public get dayOfWeek(): DayOfWeek {
		return this._timestamp.getDay()
			;
	}

	public get hour(): number {
		return this._timestamp.getHours()
			;
	}

	public get minute(): number {
		return this._timestamp.getMinutes()
			;
	}

	public get second(): number {
		return this._timestamp.getSeconds()
			;
	}

	public get millisecond(): number {
		return this._timestamp.getMilliseconds()
			;
	}

	//#endregion

	//#region function

	public static now(): DateTime {
		return new DateTime(new Date(), false);
	}

	public static utcNow(): DateTime {
		return new DateTime(new Date(), true);
	}

	private static createCore(isUtc: boolean, year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		let date: Date | null = null;
		if (hour === undefined) {
			date = new Date(year, month - 1, day);
		} else if (minute === undefined) {
			date = new Date(year, month - 1, day, hour);
		} else if (second === undefined) {
			date = new Date(year, month - 1, day, hour, minute);
		} else if (millisecond === undefined) {
			date = new Date(year, month - 1, day, hour, minute, second);
		} else {
			date = new Date(year, month - 1, day, hour, minute, second, millisecond);
		}
		return new DateTime(date, isUtc);
	}

	public static create(year: number, month: number, day: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number, second: number): DateTime;
	public static create(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): DateTime;
	public static create(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		return this.createCore(false, year, month, day, hour, minute, second, millisecond);
	}

	public static createUtc(year: number, month: number, day: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number, second: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour: number, minute: number, second: number, millisecond: number): DateTime;
	public static createUtc(year: number, month: number, day: number, hour?: number, minute?: number, second?: number, millisecond?: number): DateTime {
		return this.createCore(true, year, month, day, hour, minute, second, millisecond);
	}

	//#endregion
}

