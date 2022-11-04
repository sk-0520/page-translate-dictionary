import * as dom from '../../core/dom';

export default class ImportLogger {
	//#region variable

	private readonly _logElement: HTMLOListElement;

	//#endregion

	constructor() {
		this._logElement = dom.requireElementById<HTMLOListElement>('import-log');
	}

	//#region function

	public clear() {
		this._logElement.innerHTML = '';
	}

	public add(message: string) {
		const li = document.createElement('li');
		li.textContent = message;
		this._logElement.appendChild(li);
	}

	//#endregion
}
