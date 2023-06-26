import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const Storage: ICustomStorage = new CustomStorage();

export default async function handleResetBtnClick(e: Event) {
	e.preventDefault();

	console.log('reset');

	const filterInput1 = document.querySelector('#filter-input-1') as HTMLInputElement;
	const filterInput2 = document.querySelector('#filter-input-2') as HTMLInputElement;
	const filterInput3 = document.querySelector('#filter-input-3') as HTMLInputElement;
	const filterInput4 = document.querySelector('#filter-input-4') as HTMLInputElement;
	const filterInput5 = document.querySelector('#filter-input-5') as HTMLInputElement;

	filterInput1.value = '';
	filterInput2.value = '';
	filterInput3.value = '';
	filterInput4.value = '';
	filterInput5.value = '';

	if (Storage.items.firstDate && Storage.items.secondDate) {
		Storage.items.firstDate.value = '';
		Storage.items.secondDate.value = '';
	}

	const dbSelect1 = document.querySelector('#db-select-1') as HTMLSelectElement;
	const dbSelect2 = document.querySelector('#db-select-2') as HTMLSelectElement;
	const dbSelect3 = document.querySelector('#db-select-3') as HTMLSelectElement;
	const dbSelect4 = document.querySelector('#db-select-4') as HTMLSelectElement;
	const dbSelect5 = document.querySelector('#db-select-5') as HTMLSelectElement;

	dbSelect1.selectedIndex = 0;
	dbSelect2.selectedIndex = 0;
	dbSelect3.selectedIndex = 0;
	dbSelect4.selectedIndex = 0;
	dbSelect5.selectedIndex = 0;

	/*
	Storage.items.dataSourceOption === 'Datenbank'
		? Storage.setItem('data', await fetchData('http://localhost:3000/load-fetch'))
		: Storage.setItem('data', [...Storage.items.staticData ?? []] as object[]);

	rowsAmount.innerHTML = `${Storage.items.staticDataLength}`;

	Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		if (Storage.items.allValues && Array.isArray(Storage.items.allValues.values)) {
			Storage.items.allValues.values.forEach((value: string) => {
				const option: HTMLOptionElement = document.createElement('option');
				option.className = 'datalist-option';
				option.value = value;
				datalist.appendChild(option);
			});
		}
	});
	*/

	submitBtn.click();
};