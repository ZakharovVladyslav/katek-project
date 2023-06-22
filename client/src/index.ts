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
import handleFindingOutKeyByValue from './eventListeners/FindingOutKeyByValue'
import handleInputFormSubmit from './eventListeners/SubmitHandler.ts';
//-------------------------------------------------------------------------------------------------


//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: Record<string, any> = new CustomStorage();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const saveButton = document.querySelector('#save') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const clickToggler = document.querySelector('#click-toggler') as HTMLSelectElement;
const saveSelector = document.querySelector('#save-file-select') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const filters = document.querySelector('#filters') as HTMLDivElement;
const saveDiv = document.querySelector('#save-div') as HTMLDivElement;
const shownRowsCounterDiv = document.querySelector('.shown-rows-counter-div') as HTMLDivElement;
const fullTableSection = document.querySelector('#full-table-section') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const realRowsNumber = document.querySelector('#real-rows-number') as HTMLParagraphElement;
const shownRowsCounter = document.querySelector('#shown-rows-counter') as HTMLParagraphElement;
const modeLabel = document.querySelector('#mode-label') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// FORM--------------------------------------------------------------------------------------------
const inputForm = document.querySelector('#input-form') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

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

window.addEventListener('load', HandleWindowLoad);
dbConnectBtn?.addEventListener('click', HandleDBConnectionBtnClick);
dataSource?.addEventListener('change', handleDataSourceChange);

const file: HTMLInputElement | null = document.querySelector('#file-choose');

if (file) {
	/**
	* Event listens file on input to receive input data from the file
	*/
	file.addEventListener('input', handleCsvFileInput);
}

// listens to the first date change to change number of rows that will be outputed
document.querySelector<HTMLSelectElement>('#left-date-inp')?.addEventListener('change', handleLeftDateChange);

// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp')?.addEventListener('change', handleRightDateChange);

const handleSaveSelectorChange = () => {
	Storage.setItem('saveOption', saveSelector?.options[saveSelector.selectedIndex].value as string);
	PopUpHeadersSelect();
};
saveSelector?.addEventListener('change', handleSaveSelectorChange);

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



/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/**
 * Main listener
 */

inputForm?.addEventListener('submit', handleInputFormSubmit);
