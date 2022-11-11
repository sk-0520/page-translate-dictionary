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
		const li = dom.createHtml('li');
		li.element.textContent = message;

		dom.append(this._logElement, li);
	}

	//#endregion
}
