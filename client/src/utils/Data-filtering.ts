'use strict';

import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.js';
import { FullDataInterface } from './types.js';

const Storage: ICustomStorage = new CustomStorage();

export default function getFilters() {
	Storage.setItem('firstDate', (document.querySelector('#left-date-inp') as HTMLInputElement)?.value || '');
	Storage.setItem('secondDate', (document.querySelector('#right-date-inp') as HTMLInputElement)?.value || '');

	if (Storage.items.staticData) {
		let inputData: FullDataInterface[] | undefined = [...Storage.items.staticData];

		const select = document.getElementById('date-params') as HTMLSelectElement | null;
		const opt: string | undefined = select?.options[select?.selectedIndex]?.value;

		const startDate: Date = new Date(Storage.items.firstDate?.value as string);
		const finishDate: Date = new Date(Storage.items.secondDate?.value as string);

		if ((Storage.items.firstDate?.value !== undefined && Storage.items.firstDate?.value !== '') &&
			(Storage.items.secondDate?.value !== undefined && Storage.items.secondDate?.value !== '')) {
			console.log('w');
			if (opt) {
				inputData = inputData.filter((object: { [key: string]: any }) => {
					const objectDate: Date = new Date(object[opt]);

					return objectDate >= startDate && objectDate < finishDate;
				});
			}
		}

		let inputFields: HTMLInputElement[] = [
			document.querySelector('#filter-input-1') as HTMLInputElement,
			document.querySelector('#filter-input-2') as HTMLInputElement,
			document.querySelector('#filter-input-3') as HTMLInputElement,
			document.querySelector('#filter-input-4') as HTMLInputElement,
			document.querySelector('#filter-input-5') as HTMLInputElement,
		];
		let filteredArray;

		inputFields = inputFields.filter((field: HTMLInputElement | null) => field?.value !== '');

		const values: string[] = inputFields.map((filter: HTMLInputElement) => filter.value).filter((filter: string) => filter !== undefined);

		let keys: string[] = (Storage.items.dbSelects ?? []).map((dbSelect: HTMLSelectElement, index: number) => {
			if (Storage.items.inputFields && Storage.items.inputFields[index].value !== '')
				return dbSelect.options[dbSelect.selectedIndex]?.value || '';

		}).filter((key: string | undefined): key is string => key !== undefined) ?? [];

		filteredArray = inputData.filter((obj: FullDataInterface) => {
			return keys?.every((key: string) => {
				return values.includes(obj[key]);
			});
		});

		inputData = undefined;

		return filteredArray;
	}
}
