'use strict';

import CustomStorage from '../Storage/Local-Storage.js';

const Storage = new CustomStorage();

export default function getFilters() {
	Storage.setItem('firstDate', document.querySelector('#left-date-inp') as HTMLInputElement);
	Storage.setItem('secondDate', document.querySelector('#right-date-inp') as HTMLInputElement);

	let inputData: object[] | undefined = [...Storage.items.staticData];

	const select = document.getElementById('date-params') as HTMLSelectElement | null;
	const opt: string = select?.options[select?.selectedIndex]?.value;

	const startDate: Date = new Date(Storage.items.firstDate.value);
	const finishDate: Date = new Date(Storage.items.secondDate.value);

	if (Storage.items.firstDate.value !== '' && Storage.items.secondDate.value !== '') {
		inputData = inputData.filter(object => {
			const objectDate: Date = new Date(object[opt]);

			return objectDate >= startDate && objectDate < finishDate;
		});
	}

	let inputFields: HTMLInputElement[] | null[] = [
        document.querySelector('#filter-input-1') as HTMLInputElement | null,
        document.querySelector('#filter-input-2') as HTMLInputElement | null,
        document.querySelector('#filter-input-3') as HTMLInputElement | null,
        document.querySelector('#filter-input-4') as HTMLInputElement | null,
        document.querySelector('#filter-input-5') as HTMLInputElement | null
	];
	let filteredArray: object[] = [];

	inputFields = inputFields.filter(field => field.value !== '');

	const values: string[] = inputFields.map((filter: HTMLInputElement) => {
		if (filter.value !== '')
			return filter.value;
	}).filter(filter => filter !== undefined);

	let keys: string[] = [];
	const avoidableKeys: string[] = ['tLatenz', 'tLatenzSumme', 'tCycle', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

	inputData.forEach((obj: object) => {
		values.forEach((value: string) => {
			Object.keys(obj).forEach((key: string) => {
				if (obj[key] === value && !avoidableKeys.includes(key)) {
					keys.push(key);
				}
			});
		});
	});

	keys = Array.from(new Set(keys));

	filteredArray = inputData.filter(obj => {
		return keys.every(key => {
			return values.includes(obj[key]);
		});
	});

	inputData = null;

	return filteredArray;
}
