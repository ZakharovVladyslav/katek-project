'use strict';

/* Functions import from other files */
import CustomStorage from './services/Storage/CustomStorage.ts';
import PopUpHeadersSelect from './components/PopupHeadersSelect/PopUpHeadersSelect.ts';

// EVENT LISTENERS FROM EXTERNAL FILES-------------------------------------------------------------
import SaveDataInCsv from './eventListeners/csvSave.ts';
import HandleWindowLoad from './eventListeners/windowLoad.ts';
import HandleDBConnectionBtnClick from './eventListeners/dBConnectionBtnClick.ts';
import handleDataSourceChange from './eventListeners/dataSourceChange.ts';
import handleCsvFileInput from './eventListeners/csvFileInput.ts';
import { handleLeftDateChange, handleRightDateChange } from './eventListeners/handleDatesChange.ts';
import handleResetBtnClick from './eventListeners/resetButtonClick.ts';
import handleDateInputSectionClick from './eventListeners/dateInputEraser.ts';
import handleFiltersEraserClick from './eventListeners/filtersEraser.ts';
import handleFindingOutKeyByValue from './eventListeners/filterDataByValues.ts'
import handleInputFormSubmit from './eventListeners/submitHandler.ts';
import handleTableCheckboxChange from './eventListeners/componentsTogglers/dataTableToggler.ts';
//-------------------------------------------------------------------------------------------------

import { ICustomStorage } from './services/Storage/CustomStorage.ts';
import handlePieDiagramCheckboxChange from './utils/renderComponents/PieDiagram.ts';
import { handleLoadFilters, handleFiltersClearButtonClick } from './eventListeners/loadFilters.ts';
import handleFullTableCheckboxChange from './eventListeners/componentsTogglers/fullTableToggler.ts';
import handleSummaryRowShowHide from './eventListeners/componentsTogglers/summaryToggler.ts';
import { DISPLAY } from './utils/enums.ts';
import showMoreResults from './eventListeners/componentsTogglers/showMoreResults.ts';
import {
	appearDisappearDiagramsSection,
	appearDisappearTablesSection,
	returnBackFromDiagramsSection,
	returnBackFromTablesSection
} from './eventListeners/componentsTogglers/diagramsSectionToggler.ts';
import { ISetDisplay, SetDisplay } from './services/Display/setDisplayClass.ts';
import dateTableToggler from './eventListeners/dateTable/dateTableToggler.ts';

//import LoginWindow from './components/login-form/Login-window.ts';

/* Defining storage classes instances */
const Storage: ICustomStorage = new CustomStorage();
const Display: ISetDisplay = new SetDisplay();

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const saveButton = document.querySelector('#save') as HTMLButtonElement;
const submitButton = document.querySelector('#submit-button') as HTMLButtonElement;
const toggleButton = document.querySelector('#scale-filters-wrapper-toggler') as HTMLButtonElement;
const rightArrow = document.querySelector('#right-arrow') as HTMLButtonElement;
const leftArrow = document.querySelector('#left-arrow') as HTMLButtonElement;
const clearLoadedFiltersButton = document.querySelector('#load-filters-clear-btn') as HTMLButtonElement;
const scrollToTopBtn = document.querySelector('#scroll-to-top-btn') as HTMLButtonElement;
const scrollToTheBottom = document.querySelector('#scroll-to-the-bottom') as HTMLButtonElement;
const showMoreResultsBtn = document.querySelector('#show-more-results-btn') as HTMLButtonElement;
const returnBackDiagramsBtn = document.querySelector('#return-back-from-diagrams-section-btn') as HTMLButtonElement;
const returnBackTablesBtn = document.querySelector('#return-back-from-tables-section-btn') as HTMLButtonElement;
const dateTableLeftArrow = document.querySelector('#date-table-left-arrow') as HTMLButtonElement;
const dateTableRightArrow = document.querySelector('#date-table-right-arrow') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const saveFileSelector = document.querySelector('#save-file-select') as HTMLSelectElement;
const dataSource = document.querySelector('#input-data-select') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// DIVS--------------------------------------------------------------------------------------------
const filters = document.querySelector('#filters') as HTMLDivElement;
const fullTableSection = document.querySelector('#full-table-section') as HTMLDivElement;
const diagramsLink = document.querySelector('#diagrams-link') as HTMLDivElement;
const tablesLink = document.querySelector('#tables-link') as HTMLDivElement;
const diagramsSection = document.querySelector('#diagrams-section') as HTMLDivElement;
const contentSection = document.querySelector('#content-buttons') as HTMLDivElement;
const tablesSection = document.querySelector('#tables-section') as HTMLDivElement;
const filtersNDatesSection = document.querySelector('#filters-date-submit') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

// FORM--------------------------------------------------------------------------------------------
const inputForm = document.querySelector('#input-form') as HTMLTableElement;
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullNStaticTableSection = document.querySelector('#full-n-static-table-section') as HTMLTableElement;
const countPFTable = document.querySelector('#countPF-table') as HTMLTableElement;
const tlogTable = document.querySelector('#tlog-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

// LABELS -----------------------------------------------------------------------------------------
const tableCheckboxLabel = document.querySelector("#content-label-table") as HTMLLabelElement;
const pieDiagramCheckboxLabel = document.querySelector('#content-label-pieDiagram') as HTMLLabelElement;
const summaryRowCheckboxLabel = document.querySelector('#content-label-summaryRow') as HTMLLabelElement;
const loadFiltersLabel = document.querySelector("#load-filters-lbl") as HTMLLabelElement;
const dateTableLabel = document.querySelector('#content-label-date-table') as HTMLLabelElement;
//-------------------------------------------------------------------------------------------------

const tableCheckbox: HTMLInputElement | null = document.querySelector('#content-input-table');
const fullTableCheckbox = document.querySelector('#content-input-fullTable') as HTMLInputElement;
const leftDatePicker = document.querySelector('#left-inner-date-picker') as HTMLInputElement;
const rightDatePicker = document.querySelector('#right-inner-date-picker') as HTMLInputElement;

//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------

if (tableCheckbox)
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
			if (fullTableSection.getBoundingClientRect().height !== 0) {
				leftArrow.classList.add('fixed-button-left', 'show-button-left');
				rightArrow.classList.add('fixed-button-right', 'show-button-right');
				fullTableSection.classList.add('show-table-section');
			}

			dateTableLeftArrow.classList.add('fixed-dt-arrow-left', 'show-dt-arrow-left');
			dateTableRightArrow.classList.add('fixed-dt-arrow-right', 'show-dt-arrow-right');
		} else {
			if (fullTableSection.getBoundingClientRect().height !== 0) {
				leftArrow.classList.remove('fixed-button-left', 'show-button-left');
				rightArrow.classList.remove('fixed-button-right', 'show-button-right');
				fullTableSection.classList.remove('show-table-section');
			}

			dateTableLeftArrow.classList.remove('fixed-dt-arrow-left', 'show-dt-arrow-left');
			dateTableRightArrow.classList.remove('fixed-dt-arrow-right', 'show-dt-arrow-right');
		}
	}

	if (scrollPosition > 900) {
		scrollToTopBtn.setAttribute(
			'style',
			`opacity: 1; position: fixed; right: 3px; top: 800px; transition: ease 0.2s`
		);
		scrollToTopBtn.disabled = false;
	} else {
		scrollToTopBtn.setAttribute(
			'style',
			'opacity: 0;'
		);
		scrollToTopBtn.disabled = true;
	}

	if (dataTable.getBoundingClientRect().height !== 0 || fullNStaticTableSection.getBoundingClientRect().height !== 0) {
		if (scrollPosition > document.body.scrollHeight - 940) {
			scrollToTheBottom.setAttribute(
				'style',
				'opacity: 0; transition: ease 0.2s;'
			)
		} else {
			scrollToTheBottom.setAttribute(
				'style',
				'opacity: 1; position: fixed; right: 3px; top: 860px; transition: ease 0.2s;'
			)
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

diagramsLink.addEventListener('click', appearDisappearDiagramsSection);
tablesLink.addEventListener('click', appearDisappearTablesSection);
returnBackDiagramsBtn.addEventListener('click', returnBackFromDiagramsSection);
returnBackTablesBtn.addEventListener('click', returnBackFromTablesSection)

toggleButton.addEventListener('click', (e: MouseEvent) => {
	const target = e.target as HTMLElement;

	target.classList.toggle('active');


	// target.classList.contains('active')
	// ? filtersSectionWrapper.style.height = '582px'
	// : filtersSectionWrapper.style.height = '0px';

	if (!target.classList.contains('active')) {
		console.log(Display.checkElementsDisplayProperty(contentSection));
		console.log(Display.checkElementsDisplayProperty(diagramsSection));
		console.log(Display.checkElementsDisplayProperty(fullTableSection));

		if (Display.checkElementsDisplayProperty(diagramsSection) !== 'none')
			Display.setDisplayNONE(diagramsSection);

		if (Display.checkElementsDisplayProperty(tablesSection))
			Display.setDisplayNONE(tablesSection);

		Display.setDisplayNONE(contentSection);
		Display.setDisplayNONE(filtersNDatesSection);
	} else {
		Display.setDisplayFLEX(contentSection);
		Display.setDisplayFLEX(filtersNDatesSection);
	}
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

showMoreResultsBtn?.addEventListener('click', showMoreResults);

/**
 * Event listener for table content button
 * It will make table appear and disappear by clicking on the button
 */
tableCheckboxLabel?.addEventListener('click', handleTableCheckboxChange);
fullTableCheckbox?.addEventListener('click', handleFullTableCheckboxChange);
pieDiagramCheckboxLabel?.addEventListener('click', handlePieDiagramCheckboxChange);
summaryRowCheckboxLabel?.addEventListener('click', handleSummaryRowShowHide);

dateTableLabel?.addEventListener('click', dateTableToggler);
dateTableLeftArrow.addEventListener('click', () => {
	Display.setDisplayNONE(dateTableLeftArrow);
	Display.setDisplayBLOCK(dateTableRightArrow);

	Display.setDisplayNONE(tlogTable);

	Display.setDisplayTABLE(dataTable);
	Display.setDisplayTABLE(countPFTable);

	submitButton.click();
})

dateTableRightArrow.addEventListener('click', () => {
	Display.setDisplayNONE(dateTableRightArrow);
	Display.setDisplayBLOCK(dateTableLeftArrow);

	Display.setDisplayTABLE(tlogTable);

	Display.setDisplayNONE(dataTable);
	Display.setDisplayNONE(countPFTable);

	submitButton.click();
})

leftDatePicker.addEventListener('change', () => {
	Storage.setItem('leftInnerDate', leftDatePicker.value);
})

rightDatePicker.addEventListener('change', () => {
	Storage.setItem('rightInnerDate', rightDatePicker.value);
})

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/**
 * Main listener
 */

inputForm?.addEventListener('submit', handleInputFormSubmit);

scrollToTopBtn.addEventListener('click', () => {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	})
})

scrollToTheBottom.addEventListener('click', () => {
	window.scrollTo({
		top: document.body.scrollHeight,
		behavior: 'smooth'
	})
})
