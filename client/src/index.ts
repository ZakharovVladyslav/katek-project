'use strict';

/* Functions import from other files */
import CustomStorage from './services/Storage/CustomStorage.ts';
import PopUpHeadersSelect from './components/PopupHeadersSelect/PopUpHeadersSelect.ts';

// EVENT LISTENERS FROM EXTERNAL FILES-------------------------------------------------------------
import SaveDataInCsv from './eventListeners/CsvSave.ts';
import HandleWindowLoad from './eventListeners/WindowLoad.ts';
import HandleDBConnectionBtnClick from './eventListeners/DBConnectionBtnClick.ts';
import handleDataSourceChange from './eventListeners/DataSourceChange.ts';
import handleCsvFileInput from './eventListeners/CsvFileInput.ts';
import { handleLeftDateChange, handleRightDateChange } from './eventListeners/HandleDatesChange.ts';
import handleResetBtnClick from './eventListeners/ResetButtonClick.ts';
import handleDateInputSectionClick from './eventListeners/DateInputEraser.ts';
import handleFiltersEraserClick from './eventListeners/FiltersEraser.ts';
import handleFindingOutKeyByValue from './eventListeners/FilterDataByValues.ts'
import handleInputFormSubmit from './eventListeners/SubmitHandler.ts';
import handleTableCheckboxChange from './eventListeners/ShowHideTable.ts';
//-------------------------------------------------------------------------------------------------

import { ICustomStorage } from './services/Storage/CustomStorage.ts';
import handlePieDiagramCheckboxChange from './eventListeners/PieDiagram.ts';
import { handleLoadFilters, handleFiltersClearButtonClick } from './eventListeners/LoadFilters.ts';
import handleFullTableCheckboxChange from './eventListeners/FullTableCheckboxChange.ts';
import handleSummaryRowShowHide from './eventListeners/SummaryShowHide.ts';
import { DISPLAY } from './utils/enums.ts';

//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: ICustomStorage = new CustomStorage();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const saveButton = document.querySelector('#save') as HTMLButtonElement;
const toggleButton = document.querySelector('#scale-filters-wrapper-toggler') as HTMLButtonElement;
const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;
const clearLoadedFiltersButton = document.querySelector('#load-filters-clear-btn') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const saveFileSelector = document.querySelector('#save-file-select') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const filters = document.querySelector('#filters') as HTMLDivElement;
const filtersSectionWrapper = document.querySelector('#filters-wrapper') as HTMLDivElement;
const fullTableSection = document.querySelector('#full-table-section') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// FORM--------------------------------------------------------------------------------------------
const inputForm = document.querySelector('#input-form') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

// LABELS -----------------------------------------------------------------------------------------
const tableCheckboxLabel = document.querySelector("#content-label-table") as HTMLLabelElement;
const pieDiagramCheckboxLabel = document.querySelector('#content-label-pieDiagram') as HTMLLabelElement;
const summaryRowCheckboxLabel = document.querySelector('#content-label-summaryRow') as HTMLLabelElement;
const loadFiltersLabel = document.querySelector("#load-filters-lbl") as HTMLLabelElement;
//-------------------------------------------------------------------------------------------------

const tableCheckbox = document.querySelector('#content-input-table') as HTMLInputElement;
const fullTableCheckbox = document.querySelector('#content-input-fullTable') as HTMLInputElement;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

tableCheckbox.checked = true;
document.querySelector('#over-tables')?.setAttribute('style', 'display: none;');

Storage.setItem('dataSourceOption',
	dataSource?.options[dataSource?.selectedIndex]?.value
);

/*****************************************************************************************************************/
/*----------------------------------------- SEPARATE EVENT LISTENERS --------------------------------------------*/
/*****************************************************************************************************************/

const dbConnectBtn = document.querySelector('#db-connect');

window.addEventListener('load', HandleWindowLoad);

dbConnectBtn?.addEventListener('click', HandleDBConnectionBtnClick);

dataSource?.addEventListener('change', handleDataSourceChange);

window.addEventListener('scroll', () => {
	const scrollPosition = window.scrollY;

	if (fullTableSection.getAttribute('style') !== DISPLAY.NONE) {
		if (scrollPosition >= 373) {
			leftArrow.classList.add('fixed-button-left', 'show-button-left');
			rightArrow.classList.add('fixed-button-right', 'show-button-right');
			fullTableSection.classList.add('show-table-section');
		} else {
			leftArrow.classList.remove('fixed-button-left', 'show-button-left');
			rightArrow.classList.remove('fixed-button-right', 'show-button-right');
			fullTableSection.classList.remove('show-table-section');
		}
	}
});

const file: HTMLInputElement | null = document.querySelector('#file-choose');

if (file) {
	/**
	* Event listens file on input to receive input data from the file
	*/
	file.addEventListener('input', handleCsvFileInput);
}

toggleButton.addEventListener('click', (e: MouseEvent) => {
	const target = e.target as HTMLElement;

	target.classList.toggle('active');


	// target.classList.contains('active')
	// ? filtersSectionWrapper.style.height = '582px'
	// : filtersSectionWrapper.style.height = '0px';

	target.classList.contains('active')
		? filtersSectionWrapper.setAttribute('style', DISPLAY.BLOCK)
		: filtersSectionWrapper.setAttribute('style', DISPLAY.NONE);
})

// listens to the first date change to change number of rows that will be outputed
document.querySelector<HTMLSelectElement>('#left-date-inp')?.addEventListener('change', handleLeftDateChange);

// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp')?.addEventListener('change', handleRightDateChange);

const handleSaveSelectorChange = () => {
	const saveFileSelectorOption = saveFileSelector.options[saveFileSelector.selectedIndex].value

	if (saveFileSelectorOption === 'Headers' || saveFileSelectorOption === 'Headers & Filters')
		document.querySelector<HTMLButtonElement>('#call-popup')?.setAttribute('style', DISPLAY.INLINE_BLOCK)

	Storage.setItem('saveOption', saveFileSelector?.options[saveFileSelector.selectedIndex].value as string);
	PopUpHeadersSelect();
};
saveFileSelector?.addEventListener('change', handleSaveSelectorChange);

/**
 * Save button needs to save current object[]/table state / filters / headers / filters w/ headers to the file
 * Storage.items.filters will mean filters that sorted initial array to the current state
 */

saveButton?.addEventListener('click', SaveDataInCsv);

/**
 * On click reset all input fields will be cleared and number of rows will be static data length
 */

resetBtn?.addEventListener('click', handleResetBtnClick);

/**
 * Eraser for dates input fields
 * On click will erase value from the date input fields and calculate amount of rows that will be outputted
 */

document.querySelector<HTMLInputElement>('#date-input')?.addEventListener('click', handleDateInputSectionClick);

/**
 * Erasers for filters
 * Will erase value from the input field next to the eraser that has been pressed
 * + Will calculate amount of rows that will be outputted
 * + Will update array and fill dropdowns with values from the updated array
 */

filters?.addEventListener('click', handleFiltersEraserClick);
filters?.addEventListener('click', handleFindingOutKeyByValue);

loadFiltersLabel?.addEventListener('click', handleLoadFilters);
clearLoadedFiltersButton?.addEventListener('click', handleFiltersClearButtonClick);


/**
 * Event listener for table content button
 * It will make table appear and disappear by clicking on the button
 */
tableCheckboxLabel?.addEventListener('click', handleTableCheckboxChange);
fullTableCheckbox.addEventListener('click', handleFullTableCheckboxChange);
pieDiagramCheckboxLabel?.addEventListener('click', handlePieDiagramCheckboxChange);
summaryRowCheckboxLabel?.addEventListener('click', handleSummaryRowShowHide);

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/**
 * Main listener
 */

inputForm?.addEventListener('submit', handleInputFormSubmit);
