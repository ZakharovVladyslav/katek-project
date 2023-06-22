import DropdownValues from "../utils/Dropdown-values";
import CustomStorage from "../services/Storage/CustomStorage";
import getFilters from "../utils/Data-filtering";
import DBQuery from "../utils/DBQuery";

const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;

const Storage = new CustomStorage();

export default async function handleFindingOutKeyByValue(e: MouseEvent) {
	const target: HTMLElement = e.target as HTMLElement;
	const targetId: string = target.id;
	const targetNumber: string = targetId.slice(-1);
	const targetField: HTMLInputElement | null = document.querySelector<HTMLInputElement>(`#filter-input-${targetNumber}`);

	let dropdownValues: {
		values: string[];
		valueToHeaderMap: { [key: string]: any };
	} | null;

	if (targetField) {
		const handleTargetFieldChange = async () => {
			dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
			const selectedValue: string = targetField.value;
			const selectedValueHeader: string = dropdownValues?.valueToHeaderMap[selectedValue];

			let targetIndex = -1;
			for (let i = 0; i < Storage.items.dbSelects[+targetNumber - 1].length; i++) {
				if (Storage.items.dbSelects[+targetNumber - 1].options[i].value === selectedValueHeader) {
					targetIndex = i;
					break;
				}
			}

			Storage.items.dbSelects[+targetNumber - 1].selectedIndex = targetIndex;

			if (Storage.items.dataSourceOption === 'Datenbank') {
				await DBQuery();
			} else {
				Storage.setItem('data', getFilters() as object[]);
			}

			dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

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

			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = Storage.items.data.length;
		};
		targetField?.addEventListener('change', handleTargetFieldChange);
	}

};
