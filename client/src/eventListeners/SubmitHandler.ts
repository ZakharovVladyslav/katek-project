'use strict';

/* Functions import from other files */
import getFilters from '../utils/Data-filtering.ts';
import DropdownValues from '../utils/Dropdown-values.ts';
import CreateDiagram from '../components/Diagram/Diagram.ts';
import CustomStorage from '../services/Storage/CustomStorage.ts';
import DBQuery from '../utils/DBQuery.ts';
import renderDataTable from '../utils/renderDataTable.ts';

import printFullTable from '../components/FullTable.ts';

//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: Record<string, any> = new CustomStorage();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const rowCounterDiv = document.querySelector('#row-counter-div') as HTMLDivElement;
const contentSection = document.querySelector('#content-buttons') as HTMLDivElement;
const filtersSections = document.querySelector('#filters-date-submit') as HTMLDivElement;
const svgDiv = document.querySelector('#svg-div') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// INPUTS-------------------------------------------------------------------------------------------
const tableCheckbox = document.querySelector('#content-input-table') as HTMLInputElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;
const shownRowsCounter = document.querySelector('#shown-rows-counter') as HTMLParagraphElement;
const countpassCounter = document.querySelector('#countpass-counter') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// TABLES------------------------------------------------------------------------------------------
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

Storage.setItem('dataSourceOption',
	dataSource?.options[dataSource?.selectedIndex]?.value
);

/* If file is not inputted, submit button is not able to be pressed */
if (submitBtn)
	submitBtn.disabled = true;

export default async function handleInputFormSubmit(e: Event) {
	e.preventDefault();

	Storage.items.dataSourceOption === 'Datenbank'
		? await DBQuery()
		: Storage.setItem('data', getFilters() as object[]);

	//rowsAmount.innerHTML = `${Storage.items.staticDataLength}`;

	if (rowsAmount && Storage.items.data) {
		Storage.items.data.length === 0
			? rowsAmount.innerHTML = '0'
			: rowsAmount.innerHTML = `${Storage.items.data.length}`;
	}

	let dropdownValues: {
		values: string[];
		valueToHeaderMap: object;
	} | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders as string[]);

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
		rowCounterDiv.style.opacity = '1';
		contentSection.style.display = 'flex';
		filtersSections.style.display = 'flex';

		shownRowsCounter.style.opacity = '1';

		if (Storage.items.filtersFromJson) {
			const content = JSON.parse(Storage.items.filtersFromJson);
			let filters: string[][];

			Array.isArray(content) ? filters = content : filters = content.filters;

			filters.forEach((filter: string[], index: number) => {
				Storage.items.dbSelects[index].selectedIndex = filter[0]
				Storage.items.inputFields[index].value = filter[1];
			})
		}

		tableCheckbox.disabled = false;

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

		/*
		if (Storage.items.firstDate?.value !== '' && Storage.items.secondDate?.value === '') {
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
		else if (Storage.items.firstDate?.value === '' && Storage.items.secondDate?.value !== '') {
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
		*/

		// Number of the rows that will be outputted
		if (rowsAmount && Storage.items.data) {
			Storage.items.data.length === 0
				? rowsAmount.innerHTML = '0'
				: rowsAmount.innerHTML = Storage.items.data.length;
		}

		let dropdownValues: {
			values: string[];
			valueToHeaderMap: object;
		} | null = null;

		if (Storage.items.data && Storage.items.tableHeaders) {
			// Fullfilling dropdowns
			dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
		}

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

		if (Storage.items.data) {
			if (dataTable.getAttribute('style') !== 'display: none;')
				renderDataTable();

			if (svgDiv.getAttribute('style') !== 'display: none;')
				CreateDiagram();

			if (fullTable.getAttribute('style') !== 'display: none;')
				printFullTable();
		}
	}
};