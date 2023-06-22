'use strict';

/* Functions import from other files */
import CompleteTable from '../components/Complete-table.ts';
import getFilters from '../utils/Data-filtering.ts';
import SummaryTable from '../components/Summary-table.ts';
import DropdownValues from '../utils/Dropdown-values.ts';
import Diagram from '../components/Diagram.ts';
import CustomStorage from '../services/Storage/CustomStorage.ts';
import DBQuery from '../utils/DBQuery.ts';

import handleTableClick from './DataTableClick.ts';

//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: Record<string, any> = new CustomStorage();

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
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
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
const file: HTMLInputElement | null = document.querySelector('#file-choose');
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

export default async function handleInputFormSubmit(e: Event) {
	e.preventDefault();

	if (Storage.items.filtersFromJson) {
		const content = JSON.parse(Storage.items.filtersFromJson);
		let filters: string[][];

		Array.isArray(content) ? filters = content : filters = content.filters;

		filters.forEach((filter: string[], index: number) => {
			Storage.items.dbSelects[index].selectedIndex = filter[0]
			Storage.items.inputFields[index].value = filter[1];
		})
	}

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
	   * This event handler allows to work with table by clicking on the cell
	   */

		table?.addEventListener('click', handleTableClick);
	}
};
