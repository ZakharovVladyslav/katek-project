import DropdownValues from "../utils/dropdown-values";
import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;

const Storage: ICustomStorage = new CustomStorage();

export default async function handleFindingOutKeyByValue(e: MouseEvent) {
	const target: HTMLElement = e.target as HTMLElement;
	const targetId: string = target.id;
	const targetNumber: string = targetId.slice(-1);
	const targetField: HTMLInputElement | null = document.querySelector<HTMLInputElement>(`#filter-input-${targetNumber}`);

	if (targetField) {
		const handleTargetFieldChange = async () => {
			let dropdownValues: {
				values: string[];
				valueToHeaderMap: { [key: string]: any };
			} | null = null;

			if (Storage.items.data && Storage.items.tableHeaders)
				dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

			const selectedValue: string = targetField.value;
			const selectedValueHeader: string = dropdownValues?.valueToHeaderMap[selectedValue];

			let targetIndex = -1;
			if (Storage.items.dbSelects) {
				for (let i = 0; i < Storage.items.dbSelects[+targetNumber - 1].length; i++) {
					if (Storage.items.dbSelects[+targetNumber - 1].options[i].value === selectedValueHeader) {
						targetIndex = i;
						break;
					}
				}

				Storage.items.dbSelects[+targetNumber - 1].selectedIndex = targetIndex;
			}

			/*
			if (Storage.items.dataSourceOption === 'Datenbank')
				await DBQuery();
			else
				Storage.setItem('data', getFilters() as object[]);


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

			if (Storage.items.data)
				Storage.items.data.length === 0
					? rowsAmount.innerHTML = '0'
					: rowsAmount.innerHTML = `${Storage.items.data.length}`;
			*/
			submitBtn.click();
		};
		targetField?.addEventListener('change', handleTargetFieldChange);
	}

};
