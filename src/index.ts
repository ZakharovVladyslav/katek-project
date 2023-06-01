'use strict';

/* Functions import from other files */
import CompleteTable from './components/Complete-table.ts';
import getFilters from './utils/Data-filtering.ts';
import CsvToArray from './utils/Convert-csv.ts';
import SummaryTable from './components/Summary-table.ts';
import DropdownValues from './utils/Dropdown-values.ts';
import Diagram from './components/Diagram.ts';
import CustomStorage from './services/Storage/Local-Storage.ts';
import fillStorage from './services/Storage/FillStorage.ts';
import fetchData from './utils/FetchDbJSON.ts';
import DBQuery from './utils/DBQuery.ts';
import PopUpHeadersSelect from './components/PopupHeadersSelect/PopUpHeadersSelect.ts';
import CountpassCounter from './utils/CountpassCounter.ts';
//import LoginWindow from './components/login-form/Login-window.ts';
import { FullDataInterface } from './utils/types.ts';

/* Defining storage classes instances */
const Storage = new CustomStorage();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const reloadTable = document.querySelector('#reload-table') as HTMLButtonElement;
const saveButton = document.querySelector('#save') as HTMLButtonElement;
const fullTableBtn = document.querySelector('#full-table-button') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const clickToggler = document.querySelector('#click-toggler') as HTMLSelectElement;
const saveSelector = document.querySelector('#save-file-select') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const filters = document.querySelector('#filters') as HTMLDivElement;
const arrows = document.querySelector('#index-arrows') as HTMLDivElement;
const saveDiv = document.querySelector('#save-div') as HTMLDivElement;
const shownRowsCounterDiv = document.querySelector('.shown-rows-counter-div') as HTMLDivElement;
const fullTableSection = document.querySelector('#full-table-section') as HTMLDivElement;
const svgDiv = document.querySelector('#svg-div') as HTMLDivElement;
const overTables = document.querySelector('#over-tables') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// INPUTS-------------------------------------------------------------------------------------------
const SummaryTableInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox') as HTMLInputElement;
const rowLimiter = document.querySelector('#row-limiter') as HTMLInputElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const emptyMessage = document.querySelector('#empty-message') as HTMLParagraphElement;
const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;
const realRowsNumber = document.querySelector('#real-rows-number') as HTMLParagraphElement;
const shownRowsCounter = document.querySelector('#shown-rows-counter') as HTMLParagraphElement;
const diagrammDescription = document.querySelector('#diagramm-description') as HTMLParagraphElement;
const modeLabel = document.querySelector('#mode-label') as HTMLParagraphElement;
const countpassCounter = document.querySelector('#countpass-counter') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// TABLES------------------------------------------------------------------------------------------
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

// FORM--------------------------------------------------------------------------------------------
const inputForm = document.querySelector('#input-form') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

// SVG---------------------------------------------------------------------------------------------
const svgElement = document.querySelector('#svg-element') as SVGElement;
//--------------------------------------------------------------------------------------------------


Storage.setItem('dataSourceOption',
	dataSource?.options[dataSource?.selectedIndex]?.value
);

/* Initial styles changes for HTML Elements that will appear only after submit */
fullTableSection?.setAttribute('opacity', '0');
saveDiv?.setAttribute('opacity', '0');
realRowsNumber?.setAttribute('opacity', '0');
shownRowsCounter?.setAttribute('opacity', '0');
shownRowsCounterDiv?.setAttribute('opacity', '0');
modeLabel?.setAttribute('opacity', '0');
clickToggler?.setAttribute('display', 'none');
saveButton?.setAttribute('display', 'none');

/* If file is not inputted, submit button is not able to be pressed */
if (submitBtn)
	submitBtn.disabled = true;

/*****************************************************************************************************************/
/*----------------------------------------- SEPARATE EVENT LISTENERS --------------------------------------------*/
/*****************************************************************************************************************/

const dbConnectBtn = document.querySelector('#db-connect');

window.addEventListener('load', () => {
	const inputDataSelectOption = dataSource?.options[dataSource?.selectedIndex].value as string;

	if (inputDataSelectOption === 'Datenbank')
		clickToggler?.options[2].remove();

	/*
	if (sessionStorage.getItem('login') === null) {
		LoginWindow();
	}
	*/

	console.log('load');

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
});

const handleDbConnectBtnClick = async () => {
	try {
		Storage.setItem('data', await fetchData('/load-fetch') as object[]);

		if (Storage.items.data) {
			const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

			if (document.querySelector('#connection-check'))
				document.querySelector('#connection-check')?.remove();

			if (document.querySelector('#connection-error'))
				document.querySelector('#connection-error')?.remove();

			const connectionCheckHTML = `
            <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
         `;

			dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

			fillStorage();


			if (submitBtn)
				submitBtn.disabled = false;
			submitBtn?.click();
		}
	} catch (err) {
		const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

		if (document.querySelector('#connection-check'))
			document.querySelector('#connection-check')?.remove();

		if (document.querySelector('#connection-error'))
			document.querySelector('#connection-error')?.remove();

		const connectionCheckHTML = `
         <i class="fa-solid fa-xmark fa-2xl" style="color: #f00000;" id="connection-error"></i>
      `;

		dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

		setTimeout(() => {
			const connectionCheckElement = document.getElementById('connection-error');
			if (connectionCheckElement) {
				connectionCheckElement.remove();
			}
		}, 2500);

		console.log(err);
	}
};
dbConnectBtn?.addEventListener('click', handleDbConnectBtnClick);

const handleDataSourceChange = () => {
	submitBtn.disabled = true;
	dataTable.innerHTML = '';
	overTables.style.display = 'none';

	submitBtn.disabled = true;
	resetBtn.disabled = true;
	fullTableBtn.disabled = true;
	SummaryTableInput.disabled = true;
	pieDiagrammInput.disabled = true;
	reloadTable.disabled = true;

	Storage.setItem('dataSourceOption', dataSource?.options[dataSource.selectedIndex].value as string);

	const fileInputSection: HTMLDivElement | null = document.querySelector('#file-input-section');

	if (Storage.items.dataSourceOption === 'Datei') {
		if (fileInputSection)
			fileInputSection.innerHTML = '';

		const html = `
         <select id="delimiter-selection">
            <option id="delimiter-selection-option">,</option>
            <option id="delimiter-selection-option">;</option>
         </select>

         <label id="fc" for="file-choose">Datei öffnen</label>
         <input type="file" id="file-choose"><br>
         <p id="chosen-file" style="display: none;"></p>
      `;

		fileInputSection?.insertAdjacentHTML('beforeend', html);

		const file = document.querySelector('#file-choose') as HTMLInputElement;
		const chosenFile = document.querySelector('#chosen-file') as HTMLParagraphElement;

		file.addEventListener('input', () => {
			// As file inputted, submit button become active and clickable
			submitBtn.disabled = true;

			/**
				 * Receive file name and put it to the site
				 */
			const arrFromFileName: string[] = file?.value.replaceAll('\\', ',').split(',');

			chosenFile?.setAttribute('innerHTML', arrFromFileName[arrFromFileName.length - 1]);

			// FileReader will read file data as text
			const fileReader: FileReader = new FileReader();

			/**
				 *  file.files - object that contains data about the file from input
				 *  file.files[0] - file name
				*/
			fileReader?.addEventListener('load', (e: ProgressEvent) => {
				/**
					* e.target.result returns the whole data from the file. In this case in text
					* After text received, it stores in the Storage as inputText
					*/
				const target = e.target as FileReader;

				const text: string | ArrayBuffer | null | undefined = target?.result;

				Storage.setItem('inputText', text);

				const delimiterSelection: HTMLSelectElement | null = document.querySelector('#delimiter-selection');

				const delimiterOption: string | undefined = delimiterSelection?.options[delimiterSelection?.selectedIndex]?.value;

				/**
				 * Data will be stored as a result object[] from .csv text
				 */
				Storage.setItem('data', CsvToArray(Storage.items.inputText, delimiterOption).filter((obj) => {
					return !Object.values(obj).includes(undefined);
				}));

				fillStorage();

				submitBtn.disabled = false;
				submitBtn.click();
			});

			// Set fileReader to read data from .csv file as text
			if (file.files)
				fileReader.readAsText(file.files[0]);
		});
	}
	else if (Storage.items.dataSourceOption === 'Datenbank') {
		if (fileInputSection && dataTable) {
			fileInputSection.innerHTML = '';
			dataTable.innerHTML = '';
		}


		const html = `
         <div id="db-connect-div" class="db-connect-div">
            <button
               type="button"
               id="db-connect"
               class='db-connect'
            >Connect database</button>
         </div>
      `;

		fileInputSection?.insertAdjacentHTML('beforeend', html);

		const dbConnectBtn: HTMLButtonElement | null = document.querySelector('#db-connect');
		const dbConnectionDiv: HTMLDivElement | null = document.querySelector('#db-connect-div');

		const handleDbConnectBtnClick = async () => {
			try {
				await DBQuery();

				if (submitBtn)
					submitBtn.disabled = false;

				const connectionCheckHTML = `
               <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
            `;

				dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);

				fillStorage();
			} catch (err) {
				console.log(err);
			}
		};
		dbConnectBtn?.addEventListener('click', handleDbConnectBtnClick);
	}
};

dataSource?.addEventListener('change', handleDataSourceChange);

const file: HTMLInputElement | null = document.querySelector('#file-choose');
const chosenFile: HTMLParagraphElement | null = document.querySelector('#chosen-file');

if (file) {
	/**
	* Event listens file on input to receive input data from the file
	*/
	const handleFileInput = () => {
		// As file inputted, submit button become active and clickable
		if (submitBtn)
			submitBtn.disabled = false;

		/**
	   * Receive file name and put it to the site
	   */
		const arrFromFileName: string[] = file.value.replaceAll('\\', ',').split(',');

		if (chosenFile)
			chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1];

		// FileReader will read file data as text
		const fileReader: FileReader = new FileReader();

		/**
		 *  file.files - object that contains data about the file from input
		 *  file.files[0] - file name
		 */
		const handleLoadFileReader = (e: ProgressEvent) => {
			const target = e.target as FileReader;

			/**
			 * e.target.result returns the whole data from the file. In this case in text
			 * After text received, it stores in the Storage as inputText
			 */
			const text: string | ArrayBuffer | null | undefined = target?.result;
			Storage.setItem('inputText', text as string | ArrayBuffer);

			fillStorage();
		};
		fileReader.addEventListener('load', handleLoadFileReader);

		// Set fileReader to read data from .csv file as text
		if (file.files)
			fileReader.readAsText(file.files[0]);
	};
	file.addEventListener('input', handleFileInput);
}

// listens to the first date change to change number of rows that will be outputed
document.querySelector<HTMLSelectElement>('#left-date-inp')?.addEventListener('change', async () => {

	// opt - one of the keys [tLogIn, tLogOut, tLastAcc]
	const select: HTMLSelectElement | null = document?.querySelector('#date-params');
	const opt: string | undefined = select?.options[select?.selectedIndex]?.value;

	if (Storage.items.secondDate.value === '') {
		/**
	   * Looks for the latest date
	   * takes first object's key opt as initial value and checks if next is bigger or not
	   */
		if (Storage.items.secondDate.value === '') {
			if (opt) {
				const latestDate = Storage.items.data.reduce((latest: Date, current: Record<string, any>) => {
					const currentDate: Date = new Date(current[opt]);
					return currentDate > latest ? currentDate : latest;
				}, new Date(Storage.items.data[0][opt]));

				const rightDateInput = document.querySelector<HTMLInputElement>('#right-date-inp');
				if (rightDateInput) {
					rightDateInput.value = latestDate.toISOString().slice(0, 16);
				}
			}
		}

	}

	Storage.setItem('data', getFilters() as object[]);

	if (rowsAmount)
		rowsAmount.innerHTML = Storage.items.data.length;

	let dropdownValues: { values: string[], valueToHeaderMap: object } | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

	Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		dropdownValues?.values.forEach((value: string) => {
			const option = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});

	dropdownValues = null;
});

// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp')?.addEventListener('change', async () => {
	const select: HTMLSelectElement | null = document.querySelector('date-params');
	const opt = select?.options[select?.selectedIndex]?.value;

	if (Storage.items.secondDate.value === '') {
		if (opt) {
			const latestDate = Storage.items.data.reduce((latest: Date, current: Record<string, any>) => {
				const currentDate: Date = new Date(current[opt]);
				return currentDate < latest ? currentDate : latest;
			}, new Date(Storage.items.data[0][opt]));

			const rightDateInput = document.querySelector<HTMLInputElement>('#left-date-inp');
			if (rightDateInput) {
				rightDateInput.value = latestDate.toISOString().slice(0, 16);
			}
		}
	}


	Storage.setItem('data', getFilters() as object[]);

	if (rowsAmount)
		rowsAmount.innerHTML = Storage.items.data.length;

	let dropdownValues: { values: string[], valueToHeaderMap: object } | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

	Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		dropdownValues?.values.forEach((value: string) => {
			const option = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});

	dropdownValues = null;
});

const handleSaveSelectorChange = () => {
	Storage.setItem('saveOption', saveSelector?.options[saveSelector.selectedIndex].value as string);
	PopUpHeadersSelect();
};
saveSelector?.addEventListener('change', handleSaveSelectorChange);

/**
 * Save button needs to save current object[]/table state / filters / headers / filters w/ headers to the file
 * Storage.items.filters will mean filters that sorted initial array to the current state
 */
const handleSaveButtonClick = async () => {
	Storage.setItem('RefinedData', [[...Storage.items.allHeaders]] as string[][]);

	Storage.items.data.forEach((obj: object) => {
		let arr: object[] | null = Storage.items.RefinedData;
		arr?.push(obj);

		Storage.setItem('RefinedData', arr as object[]);
		arr = null;
	});

	if (Storage.items.saveOption === 'Table') {
		let csvContent: string | null = '';

		Storage.items.RefinedData.forEach((row: object) => {
			csvContent += Object.values(row).join(',') + '\n';
		});

		Storage.setItem('csvContent', csvContent as string);
		Storage.setItem('fileType', 'Table' as string);

		csvContent = null;
	}

	else if (Storage.items.saveOption === 'Headers') {
		Storage.setItem('csvContent', '');
		Storage.setItem('jsonContent', JSON.stringify(Storage.items.selectedHeaders, null, 4) as string);
		Storage.setItem('fileType', 'Headers' as string);
	}

	else if (Storage.items.saveOption === 'Filters') {
		Storage.setItem('csvContent', '' as string);

		const filters = Storage.items.inputFields.map((input: HTMLInputElement | null) => {
			if (input && input.value !== '')
				return input.value;
		}).filter((input: HTMLInputElement) => input !== undefined);

		Storage.setItem('jsonContent', JSON.stringify(filters, null, 4) as string);
		Storage.setItem('fileType', 'Filters' as string);
	}

	else if (Storage.items.saveOption === 'Headers & Filters') {
		Storage.setItem('csvContent', '' as string);

		const filters = Storage.items.inputFields.map((input: HTMLInputElement) => {
			if (input.value !== '')
				return input.value;
		}).filter((input: HTMLInputElement) => input !== undefined);

		let jsonContent: object = {};

		jsonContent = { ...jsonContent, headers: Storage.items.selectedHeaders };
		jsonContent = { ...jsonContent, filters: filters };

		Storage.setItem('jsonContent', JSON.stringify(jsonContent, null, 4) as string);
		Storage.setItem('fileType', 'Headers-and-filters' as string);
	}


	Storage.items.csvContent === ''
		? Storage.setItem('blob', new Blob([Storage.items.jsonContent], { type: 'application/json' }) as Blob)
		: Storage.setItem('blob', new Blob([Storage.items.csvContent], { type: 'text/csv; charset=utf-8' }) as Blob);


	const objUrl: string = URL.createObjectURL(Storage.items.blob);
	saveButton?.setAttribute('href', objUrl);

	const dateNow: Date = new Date();
	saveButton?.setAttribute('download', `${Storage.items.fileType}-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`);

	delete Storage.items.RefinedData;
};
saveButton?.addEventListener('click', handleSaveButtonClick);

/**
 * On click reset all input fields will be cleared and number of rows will be static data length
 */
const handleResetBtnClick = async (e: Event) => {
	e.preventDefault();

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

	Storage.items.firstDate.value = '';
	Storage.items.secondDate.value = '';

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

	Storage.items.dataSourceOption === 'Datenbank'
		? await fetchData('/load-fetch')
		: Storage.setItem('data', [...Storage.items.staticData] as object[]);

	if (rowsAmount)
		rowsAmount.innerHTML = Storage.items.staticDataLength;

	Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		Storage.items.allValues.values.forEach((value: string) => {
			const option: HTMLOptionElement = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});
};
resetBtn?.addEventListener('click', handleResetBtnClick);

/**
 * Eraser for dates input fields
 * On click will erase value from the date input fields and calculate amount of rows that will be outputted
 */
const handleDateInputSectionClick = async (e: MouseEvent) => {
	const target = e.target as HTMLElement;

	if (target.id.substring(0, 6) === 'eraser') {
		const targetId: string = target.id.slice(7);

		const leftDate = document.querySelector('#left-date-inp') as HTMLInputElement;
		const rightDate = document.querySelector('#right-date-inp') as HTMLInputElement;

		parseInt(targetId) === 6
			? leftDate.value = ''
			: rightDate.value = '';

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
document.querySelector<HTMLInputElement>('#date-input')?.addEventListener('click', handleDateInputSectionClick);

/**
 * Erasers for filters
 * Will erase value from the input field next to the eraser that has been pressed
 * + Will calculate amount of rows that will be outputted
 * + Will update array and fill dropdowns with values from the updated array
 */
const handleFiltersClick = async (e: MouseEvent) => {
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
filters?.addEventListener('click', handleFiltersClick);

const handleFiltersDownClick = async (e: MouseEvent) => {
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

			if (rowsAmount) {
				Storage.items.data.length === 0
					? rowsAmount.innerHTML = '0'
					: rowsAmount.innerHTML = Storage.items.data.length;
			}
		};
		targetField?.addEventListener('change', handleTargetFieldChange);
	}

};
filters?.addEventListener('click', handleFiltersDownClick);



/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/**
 * Main listener
 */
const handleInputFormSubmit = async (e: Event) => {
	e.preventDefault();

	// Call Diagram and Summary Table functions to be able to use it
	Diagram();
	SummaryTable();

	/**
	* Big part to change html elements opacity, disabled state, etc.
	*/
	if (svgElement)
		svgElement.innerHTML = '';

	svgDiv?.setAttribute('style', 'display: none;');
	diagrammDescription?.setAttribute('style', 'display: none;');

	resetBtn?.setAttribute('style', 'display: none;');
	fullTableBtn?.setAttribute('style', 'display: none;');
	SummaryTableInput?.setAttribute('style', 'display: none;');
	pieDiagrammInput?.setAttribute('style', 'display: none;');
	submitBtn?.setAttribute('style', 'display: none;');

	pieDiagrammInput.checked = true;

	saveDiv?.setAttribute('style', 'display: 0;');
	realRowsNumber?.setAttribute('style', 'display: 0;');
	shownRowsCounter?.setAttribute('style', 'display: 0;');
	shownRowsCounterDiv?.setAttribute('style', 'display: 0;');
	modeLabel?.setAttribute('style', 'display: 0;');
	saveDiv?.setAttribute('style', 'transition: 0.2s;');

	if (fullTable)
		fullTable.innerHTML = '';
	if (emptyMessage)
		emptyMessage.innerHTML = '';

	arrows?.setAttribute('style', 'opacity: 0');

	clickToggler?.setAttribute('style', 'display: none');
	saveButton?.setAttribute('style', 'display: none');

	if (dataTable)
		dataTable.innerHTML = '';

	if (reloadTable)
		reloadTable.disabled = true;

	// Creating table, thead and tbody for the main data table
	const table: HTMLTableElement = document.createElement('table');
	const thead: HTMLTableSectionElement = document.createElement('thead');
	const tbody: HTMLTableSectionElement = document.createElement('tbody');

	// Let user know if file is empty
	if (Storage.items.inputTextLength.length === 0) {
		if (file && file.DOCUMENT_NODE > 0 && dataTable)
			dataTable.innerHTML = '';
	}

	else {
		realRowsNumber?.setAttribute('style', 'opacity: 1;');
		shownRowsCounter?.setAttribute('style', 'opacity: 1;');
		shownRowsCounterDiv?.setAttribute('style', 'opacity: 1;');
		modeLabel?.setAttribute('style', 'opacity: 1;');

		clickToggler?.setAttribute('style', 'display: block;`');
		saveButton?.setAttribute('style', 'display: block;');
		submitBtn?.setAttribute('style', 'display: block;');
		reloadTable?.setAttribute('style', 'display: block;');
		fullTableBtn?.setAttribute('style', 'display: block');
		resetBtn?.setAttribute('style', 'display: block;');

		clickToggler?.setAttribute('style', 'display: block;`');
		saveButton?.setAttribute('style', 'display: block;');
		submitBtn?.setAttribute('style', 'display: block;');
		reloadTable?.setAttribute('style', 'display: block;');
		fullTableBtn?.setAttribute('style', 'display: block');
		resetBtn?.setAttribute('style', 'display: block;');

		submitBtn.disabled = false;
		resetBtn.disabled = false;
		fullTableBtn.disabled = false;
		SummaryTableInput.disabled = false;
		pieDiagrammInput.disabled = false;

		overTables.style.display = 'flex';

		if (countpassCounter)
			countpassCounter.innerHTML = '0';

		/*----------------------------------------------------------------------------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/
		/*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/

		const select: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>('#date-params');
		const opt: string | undefined = select?.options[select?.selectedIndex]?.value;

		/**
	   * Check if one the datetime-local input field is empty, second datetime-local input field will be filled
	   * with the earliest or the latest date
	   *
	   * toISOString() is a method in JavaScript that is used to convert a date object to a string in ISO format.
	   * The term "ISO" stands for "International Organization for Standardization,"
	   */

		if (Storage.items.firstDate.value !== '' && Storage.items.secondDate.value === '') {
			if (opt) {
				const latestDate = Storage.items.data.reduce((latest: Date, current: Record<string, any>) => {
					const currentDate: Date = new Date(current[opt]);
					return currentDate > latest ? currentDate : latest;
				}, new Date(Storage.items.data[0][opt]));

				const rightDateInput = document.querySelector<HTMLInputElement>('#right-date-inp');
				if (rightDateInput) {
					rightDateInput.value = latestDate.toISOString().slice(0, 16);
				}
			}
		}
		else if (Storage.items.firstDate.value === '' && Storage.items.secondDate.value !== '') {
			if (opt) {
				const latestDate = Storage.items.data.reduce((latest: Date, current: Record<string, any>) => {
					const currentDate: Date = new Date(current[opt]);
					return currentDate < latest ? currentDate : latest;
				}, new Date(Storage.items.data[0][opt]));

				const rightDateInput = document.querySelector<HTMLInputElement>('#left-date-inp');
				if (rightDateInput) {
					rightDateInput.value = latestDate.toISOString().slice(0, 16);
				}
			}
		}

		Storage.items.dataSourceOption === 'Datenbank'
			? await DBQuery()
			: Storage.setItem('data', getFilters() as object[]);

		// Number of the rows that will be outputted
		if (rowsAmount) {
			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = Storage.items.data.length;
		}

		// Fullfilling dropdowns
		let dropdownValues: {
			values: string[];
			valueToHeaderMap: object;
		} | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

		Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
			datalist.innerHTML = '';

			dropdownValues?.values.forEach((value: string) => {
				const option: HTMLOptionElement = document.createElement('option');
				option.className = 'datalist-option';
				option.value = value;
				datalist.appendChild(option);
			});
		});

		// Clearing memory
		dropdownValues = null;

		/**
	   * Building a table from the data array which is object[]
	   */
		if (dataTable)
			dataTable.innerHTML = '';

		const innerTable = document.createElement('table');
		innerTable.innerHTML = '';

		table.appendChild(thead);
		table.appendChild(tbody);

		document.querySelector<HTMLTableElement>('data-table')?.appendChild(table);

		/**
	   * Building a header row
	   * hrow - header row, creates once as there is only 1 header row
	   * theaderCell - 'th' html element that will contain header string
	   * theaderCell.innerHTML will write header into 'th' html element as <th>header</th>
	   */
		const hrow = document.createElement('tr');
		for (let i = 0; i < 16; i++) {
			const theaderCell = document.createElement('th');

			theaderCell.innerHTML = Storage.items.tableHeaders[i];
			hrow.appendChild(theaderCell);
		}
		thead.appendChild(hrow);

		/**
	   * IF rowLimiter input field IS NOT empty, then outputLimiter will be checked:
	   *    whether it is smaller than input data size or not:
	   *       if yes: outputLimiter will be size of limiter value from input field
	   *       if no: outputLimiter will be sized as input data array
	   * ELSE if rowLimiter input field is empty, then outputLimiter will have size of the input array
	   *
	   */
		if (rowLimiter && rowLimiter?.value !== '') {
			Storage.items.data.length > +rowLimiter?.value
				? Storage.setItem('limiter', +rowLimiter?.value)
				: Storage.setItem('limiter', Storage.items.data.length);
		}
		else
			Storage.setItem('limiter', Storage.items.data.length);

		if (Storage.items.limiter > 1000)
			Storage.setItem('limiter', 1000);

		if (shownRowsCounter)
			shownRowsCounter.innerHTML = `${Storage.items.limiter}`;

		/**
	   * Building a table
	   *
	   * Number of rows is limited by the outputLimiter (described above)
	   */
		for (let i = 0; i < Storage.items.limiter; i++) {
			// body_row --- <tr> in <tbody> that contains info from object
			const body_row = document.createElement('tr');

			/**
		  * Iterating through tableHeaders to print only headers that were specified
		  */
			Storage.items.tableHeaders.forEach((header: string, j: number) => {
				let tableDataHTML = '';

				/**
			 * Checks if value is NULL, then it hasn't to be printed
			 */
				if (Storage.items.data[i][header] !== 'NULL') {
					// If header is FPY then value has to be printed with % sign
					// Here using blockquote to be able to change its value later

					if (header === 'FPY') {
						tableDataHTML = `
                  <td id='cell-row${i}col${j}'>
                     <blockquote
                        contenteditable='false'
                        id='blockquote-row${i}col${j}'
                     >${Storage.items.data[i][header]}%</blockquote>
                  </td>
                  `;
					}
					else {
						tableDataHTML = `
                  <td id='cell-row${i}col${j}'>
                     <blockquote
                        contenteditable='false'
                        id='blockquote-row${i}col${j}'
                     >${Storage.items.data[i][header]}</blockquote>
                  </td>
                  `;
					}

				}
				else {
					tableDataHTML = `
                  <td id='cell-row${i}col${j}'>
                     <blockquote
                        contenteditable='false'
                        id='blockquote-row${i}col${j}'
                     >${Storage.items.data[i][header]}</blockquote>
                  </td>
               `;
				}

				// Appending element to tbody row
				body_row.insertAdjacentHTML('beforeend', tableDataHTML);
			});
			tbody.appendChild(body_row);
		}

		table.appendChild(thead);
		table.appendChild(tbody);
		dataTable?.appendChild(table);

		saveDiv?.setAttribute('style', 'opacity: 1; transition: 0.2s');

		// Calling full table function
		CompleteTable();

		/**
	   * This event handler allows user to check the whole row OR to add filters to the input field
	   */
		const handleTableClick = async (e: MouseEvent) => {
			const clickOption: string | undefined = clickToggler?.options[clickToggler?.selectedIndex].value;
			const target = e.target as HTMLElement;

			if (target.tagName === 'BLOCKQUOTE' || target.tagName === 'TD') {
				/**
				 * ClickOption is select html elment placed left-top from the table
				 *
				 * If clickOption is add to filters , so by clicking on any of the cells,
				 * value from the cell will be added to the input field
				 */
				if (clickOption === 'add-to-filters') {
					if (target.innerHTML.slice(target.innerHTML.indexOf('>') + 1, target.innerHTML.indexOf('</')) !== '') {
						const blockquotes = document.querySelectorAll('td blockquote');
						blockquotes?.forEach((blockquote: Element) => {
							(blockquote as HTMLQuoteElement).contentEditable = 'false';
						});

						const id = target.id;
						const colId = id.slice(id.indexOf('col') + 3, id.length);

						/**
						 * As we have <blockquote> inside of <td>, then we need to check
						 * either we clicked on <td> or <blockquote> because if we click on
						 * <td> - we will receive innerHTML as <blockquote>...</blockquote>,
						 * but if we clicked on blockquote directly, we will receive a cell value
						 */
						let targetCellValue = '';
						target.id.includes('blockquote')
							? targetCellValue = target.innerHTML
							// here if we click on cell we need additionaly to slice <blockquote></blockquote> to receive its innerHTML
							: targetCellValue = target.innerHTML.slice(target.innerHTML.indexOf('>') + 1, target.innerHTML.indexOf('</'));

						/**
						 * Receiving target column by slicing from col + 3 to the end of the string
						 * as our cell id has a look like `cell row0col0`
						 */
						const targetCol = target.id.slice(target.id.indexOf('col') + 3, target.id.length);

						/**
						 * Columns 13, 14 and 15 are datetime-local columns for tLogIn, tLogOut, tLastAcc
						 * So if user pressed on the date cell, it has to be added to the right place
						 */
						if (targetCol === '13' || targetCol === '14' || targetCol === '15') {
							const select: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>('#date-params');

							const indexMap = {
								'13': 0,
								'14': 1,
								'15': 2,
							};

							/**
							 * col 13 - tLogIn (selectedIndex 0 in select),
							 * col 14 - tLogOut (selectedIndex 1 in select),
							 * col 15 - tLastAcc (selectedIndex 2 in select),
							 *
							 * If user presses on the date of other key, it will change select's selectedIndex (option)
							 */
							if (targetCol in indexMap && select) {
								select.selectedIndex = indexMap[targetCol];
							}

							/**
							 * Check which one of the date inputs empty first, so date will be added there
							 */
							Storage.items.firstDate.value === ''
								? Storage.items.firstDate.value = targetCellValue.slice(0, 16)
								: Storage.items.secondDate.value = targetCellValue.slice(0, 16);
						}
						else if (targetCol === '11') {
							CountpassCounter(targetCellValue);
						}
						else {
							/**
							 * emptyFieldIndexes checks THE FIRST EMPTY input fields
							 *
							 * F.e. if IF1 and IF3 are used, the first empty will be IF2, so value from the cell will be added there
							 * If IF1 empty, value will be added there
							 */
							const emptyFieldIndexes = Storage.items.inputFields.map((filter: HTMLInputElement, index: number) => {
								if (filter.value === '')
									return index;
							}).filter((filter: HTMLInputElement) => filter !== undefined);

							if (emptyFieldIndexes.length !== 0) {
								const targetInputField = Storage.items.inputFields[emptyFieldIndexes[0]];
								targetInputField.value = targetCellValue;
								const targetInputFieldId = targetInputField.id.slice(-1);

								const targetHeader = Storage.items.objectKeysMap.get(`${colId}`);

								let targetIndex = -1;
								for (let i = 0; i < Storage.items.dbSelects[targetInputFieldId].length; i++) {
									if (Storage.items.dbSelects[targetInputFieldId].options[i].value === targetHeader) {
										targetIndex = i;
										break;
									}
								}

								Storage.items.dbSelects[targetInputFieldId - 1].selectedIndex = targetIndex;
							}
						}

						Storage.items.dataSourceOption === 'Datenbank'
							? await DBQuery()
							: Storage.setItem('data', getFilters());

						if (rowsAmount) {
							Storage.items.data.length === 0
								? rowsAmount.innerHTML = '0'
								: rowsAmount.innerHTML = Storage.items.data.length;
						}

						let dropdownValues: {
							values: string[];
							valueToHeaderMap: object;
						} | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

						Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
							datalist.innerHTML = '';

							dropdownValues?.values.forEach(value => {
								const option = document.createElement('option');
								option.className = 'datalist-option';
								option.value = value;
								datalist.appendChild(option);
							});
						});

						dropdownValues = null;
					}
				}
			}

			/**
			 * If clickOption is 'show row'	, then clicking on any of the cells in one row,
			 * the full row will be opened that contains more than 16 columns.
			 * They are divided by 5 columns each
			 */
			if (clickOption === 'show-row') {
				if (dataTable)
					dataTable.innerHTML = '';

				const blockquotes = document.querySelectorAll('td blockquote');
				blockquotes?.forEach((blockquote: Element) => {
					(blockquote as HTMLQuoteElement).contentEditable = 'false';
				});

				if (reloadTable)
					reloadTable.disabled = false;
				if (submitBtn)
					submitBtn.disabled = true;
				if (resetBtn)
					resetBtn.disabled = true;
				if (fullTableBtn)
					fullTableBtn.disabled = true;
				if (SummaryTableInput)
					SummaryTableInput.disabled = true;
				if (pieDiagrammInput)
					pieDiagrammInput.disabled = true;

				/**
				 * As we have id on each of the cells as `cell row0col0`,
				 * we can find out target id by slicing from w + 1 to col, to receive just a number
				 */
				const targetId = target.id;
				const row = targetId.slice(targetId.indexOf('w') + 1, targetId.indexOf('col'));

				console.log(row);

				// Recive the whole object by row number
				const object = Storage.items.data[row];

				console.log(object);

				if (dataTable)
					dataTable.innerHTML = '';

				const rowTable = document.createElement('table');
				rowTable.setAttribute('id', 'rowTable');

				const allHeaders = [];
				const allValues = [];

				/**
				 * allHeaders will contain ALL headers from the object
				 * allValues will contain ALL values from the object
				 */
				if (!target.innerHTML.startsWith('<')) {
					for (const [key, value] of Object.entries(object)) {
						allHeaders.push(key);
						allValues.push(value);
					}
				}

				/**
				 * Table divides columns by 9
				 */
				const divideArrByNine = (arr: string[] | unknown[]) => {
					const resultArr: string[][] = [];

					for (let i = 0; i < 3; i++) {
						const innerArr: string[] = [];
						for (let j = 0; j < 9; j++) {
							innerArr.push(arr[i * 9 + j] as string);
						}
						resultArr.push(innerArr);
					}

					return resultArr;
				};

				const resArr: string[][] = [];
				for (let i = 0; i < 3; i++) {
					resArr.push(
						divideArrByNine(allHeaders as string[])[i],
						divideArrByNine(allValues as string[])[i]
					);
				}

				const rowTableBody: HTMLTableSectionElement = document.createElement('tbody');

				for (let i = 0; i < 6; i++) {
					const tr = document.createElement('tr');
					for (let j = 0; j < 9; j++) {
						const td = document.createElement('td');
						td.innerHTML = resArr[i][j];
						tr.appendChild(td);
					}
					rowTableBody.appendChild(tr);
				}

				console.log(rowTableBody);

				if (dataTable)
					dataTable.innerHTML = '';

				rowTable.append(rowTableBody);
				dataTable?.append(rowTable);

				if (typeof(object) === 'object')
					object.length = 0;
			}
			else if (clickOption === 'change-cell-content') {
				const blockquotes = document.querySelectorAll('td blockquote');
				blockquotes?.forEach((blockquote: Element) => {
					(blockquote as HTMLQuoteElement).contentEditable = 'true';
				});
				Storage.setItem('blockquoteEditValue', '');

				const blockquoteId = target.id.slice(target.id.indexOf('r'), target.id.length);
				const rowId = blockquoteId.slice(blockquoteId.indexOf('w') + 1, blockquoteId.indexOf('c'));
				const colId = blockquoteId.slice(blockquoteId.indexOf('col') + 3, blockquoteId.length);

				let targetLogID = '';
				if (!target.innerHTML.startsWith('<')) {
					targetLogID = Storage.items.data[rowId]['LogID'];
				}
				const blockquote = document.querySelector(`#blockquote-${blockquoteId}`);

				blockquote?.addEventListener('focusout', () => {
					Storage.setItem('blockquoteEditValue', blockquote.textContent);

					const targetObject = Storage.items.staticData.find((obj: FullDataInterface) => obj['LogID'] === +targetLogID);
					const targetKey = Storage.items.objectKeysMap.get(`${colId}`);

					Storage.items.staticData[Storage.items.staticData.indexOf(targetObject)][targetKey] = Storage.items.blockquoteEditValue;

					delete Storage.items.blockquoteEditValue;
				});
			}

		};
		table?.addEventListener('click', handleTableClick);
	}
};
inputForm?.addEventListener('submit', handleInputFormSubmit);
