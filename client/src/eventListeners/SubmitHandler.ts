'use strict';

/* Functions import from other files */
import getFilters from '../utils/data-filtering.ts';
import DropdownValues from '../utils/dropdown-values.ts';
import CreateDiagram from '../components/Diagram/Diagram.ts';
import CustomStorage, { ICustomStorage } from '../services/Storage/CustomStorage.ts';
import DBQuery from '../utils/dBQuery.ts';
import renderDataTable from '../utils/renderComponents/renderDataTable.ts';

import printFullTable from '../components/FullTable/FullTable.ts';
import generateSummaryRow from '../components/SummaryTable/SummaryTable.ts';
import { ISetDisplay, SetDisplay } from '../services/Display/setDisplayClass.ts';
import renderCountPFTable from '../utils/renderComponents/dateTable/renderCountTable.ts';
import rendertLogTable from '../utils/renderComponents/dateTable/renderTLogTable.ts';

//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: ICustomStorage = new CustomStorage();
const Display: ISetDisplay = new SetDisplay();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const rowCounterDiv = document.querySelector('#row-counter-div') as HTMLDivElement;
const contentSection = document.querySelector('#content-buttons') as HTMLDivElement;
const filtersSections = document.querySelector('#filters-date-submit') as HTMLDivElement;
const svgDiv = document.querySelector('#svg-div') as HTMLDivElement;
const filtersWrapperToggler = document.querySelector('#scale-filters-wrapper-toggler') as HTMLDivElement;
const diagramsSection = document.querySelector('#diagrams-section') as HTMLDivElement;
const tablesSection = document.querySelector('#tables-section') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// INPUTS-------------------------------------------------------------------------------------------
const tableCheckbox: HTMLInputElement | null = document.querySelector('#content-input-table');
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;
const shownRowsCounter = document.querySelector('#shown-rows-counter') as HTMLParagraphElement;
const countpassCounter = document.querySelector('#countpass-counter') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// TABLES------------------------------------------------------------------------------------------
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
const summaryTable = document.querySelector('#summary-table') as HTMLTableElement;
const countPFTable = document.querySelector('#countPF-table') as HTMLTableElement;
const tlogTable = document.querySelector('#tlog-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

const scrollToTheBottomBtn = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;

export default async function handleInputFormSubmit(e: Event) {
	e.preventDefault();

	Storage.items.dataSourceOption === 'Datenbank'
		? await DBQuery()
		: Storage.setItem('data', getFilters() as object[]);

	if (rowsAmount && Storage.items.data) {
		Storage.items.data.length === 0
			? rowsAmount.innerHTML = '0'
			: rowsAmount.innerHTML = `${Storage.items.data.length}`;
	}

	Storage.setItem('limiter', Storage.items.data?.length);

	console.log(Storage.items.data);

	let dropdownValues: {
		values: string[];
		valueToHeaderMap: object;
	} | null = DropdownValues(Storage.items.data!, Storage.items.tableHeaders as string[]);

	Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
		datalist.innerHTML = '';

		dropdownValues?.values.forEach(value => {
			const option = document.createElement('option');
			option.className = 'datalist-option';
			option.value = value;
			datalist.appendChild(option);
		});
	});

	if (Storage.items.data) {
		filtersWrapperToggler.style.display = 'block';
		rowCounterDiv.style.opacity = '1';

		diagramsSection.getBoundingClientRect().height === 0 ? Display.setDisplayFLEX(contentSection) : Display.setDisplayNONE(contentSection);
		tablesSection.getBoundingClientRect().height === 0 ? Display.setDisplayFLEX(contentSection) : Display.setDisplayNONE(contentSection);

		filtersSections.style.display = 'flex';
		scrollToTheBottomBtn.style.opacity = '1';
		shownRowsCounter.style.opacity = '1';

		if (Storage.items.filtersFromJson) {
			const content = JSON.parse(Storage.items.filtersFromJson);
			let filters: string[][];

			Array.isArray(content) ? filters = content : filters = content.filters;

			filters.forEach((filter: string[], index: number) => {
				if (Storage.items.dbSelects && Storage.items.inputFields) {
					Storage.items.dbSelects[index].selectedIndex = +filter[0]
					Storage.items.inputFields[index].value = filter[1];
				}
			})
		}

		if (tableCheckbox)
			tableCheckbox.disabled = false;

		if (countpassCounter)
			countpassCounter.innerHTML = '0';

		/*----------------------------------------------------------------------------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/
		/*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/
		/*----------------------------------------------------------------------------------------------------------------*/

		// Number of the rows that will be outputted
		if (rowsAmount && Storage.items.data) {
			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = `${Storage.items.data.length}`;
		}

		let dropdownValues: {
			values: string[];
			valueToHeaderMap: object;
		} | null = null;

		if (Storage.items.data && Storage.items.tableHeaders) {
			// Fullfilling dropdowns
			dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
		}

		Storage.items.datalists?.forEach((datalist: HTMLDataListElement) => {
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

		if (Storage.items.data) {
			if (dataTable.getAttribute('style') !== 'display: none;')
				renderDataTable();

			if (svgDiv.getAttribute('style') !== 'display: none;')
				CreateDiagram();

			if (fullTable.getAttribute('style') !== 'display: none;')
				printFullTable();

			if (summaryTable.getAttribute('style') !== 'display: none;')
				generateSummaryRow();

			if (Display.checkElementsDisplayProperty(countPFTable) !== 'none')
				renderCountPFTable();

			if (Display.checkElementsDisplayProperty(tlogTable) !== 'none')
				rendertLogTable();
		}
	}
};
