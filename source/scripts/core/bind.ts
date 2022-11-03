import * as throws from './throws';

export class ElementBinder<TElement extends Element> {
	//#region variable

	private _element: WeakRef<TElement>;

	//#endregion

	public constructor(element: TElement) {
		this._element = new WeakRef(element);
	}

	//#region property

	public get element(): TElement {
		const result = this._element.deref();
		if (result) {
			return result;
		}

		throw new throws.InvalidOperationError();
	}

	//#endregion

	//#region function
	//#endregion
}

export class BindManager {
	//#region variable
	//#endregion

	//#region property

	private map = new WeakMap<Element, ElementBinder<Element>>();

	//#endregion

	//#region function

	public add<TElement extends Element>(element: TElement): ElementBinder<TElement> {
		const current = this.map.get(element);
		if (current) {
			return current as ElementBinder<TElement>;
		}

		const binder = new ElementBinder(element);
		this.map.set(element, binder);
		return binder;
	}

	//#endregion
}
