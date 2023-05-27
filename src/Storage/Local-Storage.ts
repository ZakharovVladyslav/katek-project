/* eslint-disable @typescript-eslint/no-explicit-any */
class CustomStorage {
	private static _core: Record<string, any> = {};

	private _core: Record<string, any>;

	constructor() {
		if (!CustomStorage._core) {
			CustomStorage._core = {};
		}

		this._core = CustomStorage._core;
		(window as any).CustomStorage = this;
	}

	get items(): Record<string, any> {
		return this._core;
	}

	setItem(prop: string, value: any): void {
		this._core[prop] = value;
	}

	clearStorage(): void {
		this._core = {};
	}
}

export default CustomStorage;
