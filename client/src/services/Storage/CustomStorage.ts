/* eslint-disable @typescript-eslint/no-explicit-any */

import { FullDataInterface } from "../../utils/types";

export interface ICustomStorage {
	readonly items: ICore,
	setItem: (prop: string, value: any) => void,
	clearStorage: () => void
}

interface ICore {
	tableHeaders?: string[],
	selectedHeaders?: string[],
	staticData?: FullDataInterface[],
	allHeaders?: string[],
	staticDataLength?: number,
	headers?: string[],
	allValues?: { values: string[], valueToHeaderMap: object },
	inputTextLength?: number,
	firstDate?: HTMLInputElement,
	secondDate?: HTMLInputElement,
	objectKeysMap?: Map<string, string>,
	dataSourceOption?: string,
	saveOption?: string,
	inputText?: string,
	data?: FullDataInterface[],
	RefinedData?: string[][],
	inputFields?: HTMLInputElement[],
	dbSelects?: HTMLSelectElement[],
	csvContent?: string,
	fileType?: string,
	jsonContent?: string,
	blob?: Blob | MediaSource | undefined,
	loadFiltersInput?: HTMLInputElement,
	filtersFromJson?: string,
	datalists?: HTMLDataListElement[],
	blockquoteEditValue?: string,
	sourceType?: string,
	limiter?: number,
	firstDateQuery?: string,
	secondDateQuery?: string,
	fullTablePageIndex?: number
}

class CustomStorage implements ICustomStorage {
	private static _core: Record<string, any> = {};
	private _core: Record<string, any>;

	constructor() {
		if (!CustomStorage._core)
			CustomStorage._core = {};

		this._core = CustomStorage._core;
		(window as any).CustomStorage = this;
	}

	get items(): ICore {
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
