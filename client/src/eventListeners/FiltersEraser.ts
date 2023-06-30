import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const Storage: ICustomStorage = new CustomStorage();

export default async function handleFiltersEraserClick (e: MouseEvent) {
	const target = e.target as HTMLElement;

	if (target?.id.substring(0, 6) === 'eraser') {
		const targetId: string = target?.id.slice(7);

		if (Storage.items.inputFields && Storage.items.dbSelects) {
			Storage.items.inputFields[+targetId - 1].value = '';
			Storage.items.dbSelects[+targetId - 1].selectedIndex = 0;
		}

		/*
		Storage.items.dataSourceOption === 'Datenbank'
			? await DBQuery()
			: Storage.setItem('data', getFilters() as object[]);

		if (rowsAmount && Storage.items.data) {
			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = `${Storage.items.data.length}`;
		}

		let dropdownValues: { values: string[], valueToHeaderMap: object } | null = null;
		if (Storage.items.data && Storage.items.tableHeaders)
			dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

		Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
			datalist.innerHTML = '';

			dropdownValues?.values.forEach((value: string) => {
				const option: HTMLOptionElement = document.createElement('option');
				option.className = 'datalist-option';
				option.value = value;
				datalist.appendChild(option);
			});
		});

		dropdownValues = null;
		*/

		submitBtn.click();
	}
};
