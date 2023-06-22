const clickToggler = document.querySelector('#click-toggler') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;

import CustomStorage from "../services/Storage/CustomStorage";

const Storage = new CustomStorage();

export default function HandleWindowLoad() {
    console.log('load');

	const inputDataSelectOption = dataSource?.options[dataSource?.selectedIndex].value as string;

	if (inputDataSelectOption === 'Datenbank')
		clickToggler?.options[2].remove();

	/*
	if (sessionStorage.getItem('login') === null) {
		LoginWindow();
	}
	*/

	Storage.setItem('inputFields', [
		document.querySelector('#filter-input-1') as HTMLInputElement,
		document.querySelector('#filter-input-2') as HTMLInputElement,
		document.querySelector('#filter-input-3') as HTMLInputElement,
		document.querySelector('#filter-input-4') as HTMLInputElement,
		document.querySelector('#filter-input-5') as HTMLInputElement
	] as HTMLInputElement[]);

	Storage.setItem('datalists', [
		document.querySelector('#datalist-1') as HTMLDataListElement,
		document.querySelector('#datalist-2') as HTMLDataListElement,
		document.querySelector('#datalist-3') as HTMLDataListElement,
		document.querySelector('#datalist-4') as HTMLDataListElement,
		document.querySelector('#datalist-5') as HTMLDataListElement
	] as HTMLDataListElement[]);

	const dbSelectors: HTMLSelectElement[] = [
		document.querySelector('#db-select-1') as HTMLSelectElement,
		document.querySelector('#db-select-2') as HTMLSelectElement,
		document.querySelector('#db-select-3') as HTMLSelectElement,
		document.querySelector('#db-select-4') as HTMLSelectElement,
		document.querySelector('#db-select-5') as HTMLSelectElement,
	];

	Storage.setItem('dbSelects', [...dbSelectors]);
}
