import * as dom from '../../core/dom';

export default class ImportLogger {
	//#region variable

	private readonly _logElement: HTMLOListElement;

	//#endregion

	constructor() {
		this._logElement = dom.requireElementById('import-log', HTMLOListElement);
	}

	//#region function

	public clear() {
		this._logElement.innerHTML = '';
	}

	public add(message: string) {
		const li = dom.createFactory('li');
		li.element.textContent = message;

		dom.attach(this._logElement, dom.AttachPosition.Last, li);
	}

	//#endregion
}
