'use strict';

import CustomStorage from '../services/Storage/CustomStorage.js';

const Storage: Record<string, any> = new CustomStorage();

export default function getFilters() {
	Storage.setItem('firstDate', (document.querySelector('#left-date-inp') as HTMLInputElement)?.value || '');
	Storage.setItem('secondDate', (document.querySelector('#right-date-inp') as HTMLInputElement)?.value || '');

	let inputData: object[][] | undefined = [...Storage.items.staticData];
	console.log(inputData);

	const select = document.getElementById('date-params') as HTMLSelectElement | null;
	const opt: string | undefined = select?.options[select?.selectedIndex]?.value;

	const startDate: Date = new Date(Storage.items.firstDate.value);
	const finishDate: Date = new Date(Storage.items.secondDate.value);

	console.log(Storage.items.firstDate.value);
	console.log(Storage.items.secondDate.value);
	if ((Storage.items.firstDate.value !== undefined && Storage.items.firstDate.value !== '') &&
		(Storage.items.secondDate.value !== undefined && Storage.items.secondDate.value !== '')) {
		console.log('w');
		if (opt) {
			inputData = inputData.filter((object: { [key: string]: any }) => {
				const objectDate: Date = new Date(object[opt]);

				return objectDate >= startDate && objectDate < finishDate;
			});
		}
	}
	console.log(inputData);

	let inputFields: HTMLInputElement[] = [
		document.querySelector('#filter-input-1') as HTMLInputElement,
		document.querySelector('#filter-input-2') as HTMLInputElement,
		document.querySelector('#filter-input-3') as HTMLInputElement,
		document.querySelector('#filter-input-4') as HTMLInputElement,
		document.querySelector('#filter-input-5') as HTMLInputElement,
	];
	let filteredArray: object[] = [];
	console.log(inputData);

	inputFields = inputFields.filter((field: HTMLInputElement | null) => field?.value !== '');
	console.log(inputData);

	const values: string[] = inputFields.map((filter: HTMLInputElement) => filter.value).filter((filter: string) => filter !== undefined);

	console.log(inputData);
	let keys: string[] = [];
	const avoidableKeys: string[] = ['tLatenz', 'tLatenzSumme', 'tCycle', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

	console.log(inputData);

	inputData.forEach((obj: Record<string, any>) => {
		values.forEach((value: string) => {
			Object.keys(obj).forEach((key: string) => {
				if (obj[key] === value && !avoidableKeys.includes(key)) {
					keys.push(key);
				}
			});
		});
	});

	console.log(inputData);

	keys = Array.from(new Set(keys));

	filteredArray = inputData.filter((obj: Record<string, any>) => {
		return keys.every((key) => {
			return values.includes(obj[key]);
		});
	});

	inputData = undefined;

	console.log(filteredArray);

	return filteredArray;
}
