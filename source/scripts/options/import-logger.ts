import * as dom from '../dom';

export default class ImportLogger {
	private _logElement: HTMLOListElement;
	constructor() {
		this._logElement = dom.requireElementById<HTMLOListElement>('import-log');
	}

	public clear() {
		this._logElement.innerHTML = '';
	}

	public add(message: string) {
		const li = document.createElement('li');
		li.textContent = message;
		this._logElement.appendChild(li);
	}
}
