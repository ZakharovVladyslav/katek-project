import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import data from '../data/developmentData.json';
import fillStorage from "../services/Storage/FillStorage";

const Storage: ICustomStorage = new CustomStorage();

const clickToggler = document.querySelector('#click-toggler') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;

const submitButton = document.querySelector('#submit-button') as HTMLButtonElement;

export default function HandleWindowLoad() {
	const inputDataSelectOption = dataSource?.options[dataSource?.selectedIndex].value as string;

	if (inputDataSelectOption === 'Datenbank')
		clickToggler?.options[2].remove();

	Storage.setItem('dataSourceOption', dataSource.options[dataSource.selectedIndex].value);

	if (Storage.items.dataSourceOption === 'development') {
		Storage.setItem('data', data);

		fillStorage();

		submitButton.click();
	}
}
