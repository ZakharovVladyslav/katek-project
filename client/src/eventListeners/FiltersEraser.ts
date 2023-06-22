import CustomStorage from "../services/Storage/CustomStorage";
import DBQuery from "../utils/DBQuery";
import getFilters from "../utils/Data-filtering";
import DropdownValues from "../utils/Dropdown-values";

const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;

const Storage = new CustomStorage();

export default async function handleFiltersEraserClick (e: MouseEvent) {
	const target = e.target as HTMLElement;

	if (target?.id.substring(0, 6) === 'eraser') {
		const targetId: string = target?.id.slice(7);

		Storage.items.inputFields[+targetId - 1].value = '';
		Storage.items.dbSelects[+targetId - 1].selectedIndex = 0;

		Storage.items.dataSourceOption === 'Datenbank'
			? await DBQuery()
			: Storage.setItem('data', getFilters() as object[]);
		if (rowsAmount) {
			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = Storage.items.data.length;
		}

		let dropdownValues: { values: string[], valueToHeaderMap: object } | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

		Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
			datalist.innerHTML = '';

			dropdownValues?.values.forEach((value: string) => {
				const option: HTMLOptionElement = document.createElement('option');
				option.className = 'datalist-option';
				option.value = value;
				datalist.appendChild(option);
			});
		});

		dropdownValues = null;
	}
};
