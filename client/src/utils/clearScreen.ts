import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";
import { DISPLAY } from "./enums";

const Storage: ICustomStorage = new CustomStorage();

const dataTable = document.querySelector('#data-table') as HTMLTableElement;
const fullTable = document.querySelector('#full-table-section') as HTMLTableElement;
const summaryTable = document.querySelector('#summary-table') as HTMLTableElement;

const clearLoadedFiltersButton = document.querySelector('#load-filters-clear-btn') as HTMLButtonElement;

const overTables = document.querySelector('#over-tables') as HTMLDivElement;
const svgDiv = document.querySelector('#svg-div') as HTMLDivElement;
const filtersDateSubmitSection = document.querySelector('#filters-date-submit') as HTMLDivElement;
const contentButtons = document.querySelector('#content-buttons') as HTMLDivElement;
const filtersWrapperToggler = document.querySelector("#scale-filters-wrapper-toggler") as HTMLDivElement;

const diagramDescription = document.querySelector('#diagramm-description') as HTMLParagraphElement;

export default function clearScreen() {
    dataTable.innerHTML = '';
    fullTable.innerHTML = '';
    summaryTable.innerHTML = '';

    dataTable.setAttribute('style', DISPLAY.NONE);
    fullTable.setAttribute('style', DISPLAY.NONE);
    summaryTable.setAttribute('style', DISPLAY.NONE);
    overTables.setAttribute('style', DISPLAY.NONE);
    svgDiv.setAttribute('style', DISPLAY.NONE);
    diagramDescription.setAttribute('style', DISPLAY.NONE);
    filtersDateSubmitSection.setAttribute('style', DISPLAY.NONE);
    contentButtons.setAttribute('style', DISPLAY.NONE);
    filtersWrapperToggler.setAttribute('style', DISPLAY.NONE);

    Storage.items.dbSelects?.forEach((select: HTMLSelectElement) => select.selectedIndex = 0);
    Storage.items.inputFields?.forEach((field: HTMLInputElement) => field.value = '');

    Storage.setItem('tableHeadersFromFile', null);
    clearLoadedFiltersButton.setAttribute('style', DISPLAY.NONE);
}
