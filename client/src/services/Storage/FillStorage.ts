import CustomStorage, { ICustomStorage } from './CustomStorage.js';
import DropdownValues from '../../utils/dropdown-values.js';

const rowsAmount = document.querySelector('#rows-amount');

const Storage: ICustomStorage = new CustomStorage();

export default function fillStorage() {
	Storage.setItem('dbSelects', [
		document.querySelector('#db-select-1') as HTMLSelectElement,
		document.querySelector('#db-select-2') as HTMLSelectElement,
		document.querySelector('#db-select-3') as HTMLSelectElement,
		document.querySelector('#db-select-4') as HTMLSelectElement,
		document.querySelector('#db-select-5') as HTMLSelectElement,
	] as HTMLSelectElement[]);

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

	/**
     * TableHeaders - needed for the table to print only exact columns
     * Also stores into the Storage to be able to be called later
    */
	const tableHeaders: string[] = ['ProdCode', 'Customer', 'ProdName', 'HostName', 'MatNum', 'ArticleNum', 'FPY', 'CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];
	Storage.setItem('tableHeaders', tableHeaders);

	Storage.setItem('selectedHeaders', []);

	if (Storage.items.data) {
		// StaticData - stored to be a full version of initial array
		Storage.setItem('staticData', Storage.items.data);

		// AllHeaders - needs for reset listener to fill dropdown immediately
		Storage.setItem('allHeaders', Object.keys(Storage.items.staticData![0]) as string[]);

		let fullTableHeaders = Storage.items.allHeaders?.map((header: string) => {
			const avoidableKeys = ['DBName', 'DBPath', 'Customer', 'ProdCode', 'ProdName'];

			if (!avoidableKeys.includes(header))
				return header;
		}).filter(Boolean);

		// Full table headers does not include 'DBName' and 'DBPath'
		Storage.setItem('fullTableHeaders', fullTableHeaders as string[]);
		// StaticDataLength - stored, not to calculate length later
		Storage.setItem('staticDataLength', Storage.items.staticData!.length);
		Storage.setItem('headers', Object.keys(Storage.items.data[0]));

		// AllValues - as same as allHeaders. not to calculate later. Receives all present value from the static data
		Storage.setItem('allValues', DropdownValues(Storage.items.staticData!, Storage.items.tableHeaders!) as { values: string[], valueToHeaderMap: object });

		// Stored not to keep text present as it takes lot of memory
		Storage.setItem('inputTextLength', Storage.items.data.length);
	}

	Storage.setItem('firstDate', document.querySelector('#left-date-inp') as HTMLInputElement);
	Storage.setItem('secondDate', document.querySelector('#right-date-inp') as HTMLInputElement);

	const headersMap: Map<string, string> = new Map();
	Storage.items.tableHeaders?.forEach((header: string, index: number) => {
		headersMap.set(`${index}`, `${header}`);
	});

	Storage.setItem('objectKeysMap', headersMap);

	if (Storage.items.data) {
		/**
         * dbSelects - select html elements near to input field
         * needed for db connection to define by which key database will be stored
         *
         * Is fullfilled with all column names (headers) from the file
         */
		Storage.items.dbSelects?.forEach((select: HTMLSelectElement) => {
			if (select)
				select.innerHTML = '';

			const option: HTMLOptionElement | null = document.createElement('option');

			if (option) {
				option.className = 'database-option';
				option.value = 'Select';

				option.innerHTML = 'Wählen';
				select.appendChild(option);
			}

			Object.keys(Storage.items.data![0]).forEach((header: string) => {
				const option: HTMLOptionElement = document.createElement('option');
				option.className = 'database-option';
				option.value = header;
				option.innerHTML = header;
				select.appendChild(option);
			});
		});
		// Number of rows of the updated array will be outputted
		//rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);

		if (rowsAmount)
			rowsAmount.innerHTML = `${Storage.items.data.length}`;

		// Values from updated file data to fullfill dropdowns only with actual values
		let dropdownValues: {values: string[], valueToHeaderMap: object } | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders!);

		Storage.items.datalists?.forEach((datalist: HTMLDataListElement | null) => {
			if (datalist)
				datalist.innerHTML = '';

			dropdownValues?.values.forEach((value: string | number) => {
				const option = document.createElement('option');
				option.className = 'datalist-option';
				option.value = `${value}`;
				datalist?.appendChild(option);
			});
		});

		dropdownValues = null;
	}

	// Text will be deleted not to take memory for no reason
	delete Storage.items.inputText;
}
