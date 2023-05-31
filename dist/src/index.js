/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
'use strict';
/* Functions import from other files */
import CompleteTable from './components/Table/Complete-table.js';
import getFilters from './utils/Data-filtering.js';
import CsvToArray from './utils/Convert-csv.js';
import SummaryTable from './components/Table/Summary-table.js';
import DropdownValues from './services/Data/Dropdown-values.js';
import Diagram from './components/Diagram.js';
import CustomStorage from './services/Storage/Local-Storage.js';
import fillStorage from './services/Storage/FillStorage.js';
import fetchData from './utils/FetchDbJSON.js';
import DBQuery from './services/DB/DBQuery.js';
import PopUpHeadersSelect from './components/Table/PopUpHeadersSelect.js';
import CountpassCounter from './utils/CountpassCounter.js';
/* Defining storage classes instances */
const Storage = new CustomStorage();
/* HTML Elements import */
const inputForm = document.querySelector('#input-form');
const submitBtn = document.querySelector('#submit-button');
const resetBtn = document.querySelector('#reset');
const dataTable = document.querySelector('#data-table');
const emptyMessage = document.querySelector('#empty-message');
const rowLimiter = document.querySelector('#row-limiter');
const reloadTable = document.querySelector('#reload-table');
const cellSelect = document.querySelector('#click-toggler');
const filters = document.querySelector('#filters');
const clickToggler = document.querySelector('#click-toggler');
const saveButton = document.querySelector('#save');
const rowsAmount = document.querySelector('#rows-amount');
const fullTable = document.querySelector('#full-table');
const fullTableBtn = document.querySelector('#full-table-button');
const arrows = document.querySelector('#index-arrows');
const saveDiv = document.querySelector('#save-div');
const realRowsNumber = document.querySelector('#real-rows-number');
const shownRowsCounter = document.querySelector('#shown-rows-counter');
const shownRowsCounterDiv = document.querySelector('.shown-rows-counter-div');
const fullTableSection = document.querySelector('#full-table-section');
const SummaryTableInput = document.querySelector('#summary-row-toggler-input');
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox');
const svgDiv = document.querySelector('#svg-div');
const diagrammDescription = document.querySelector('#diagramm-description');
const svgElement = document.querySelector('#svg-element');
const modeLabel = document.querySelector('#mode-label');
const saveSelector = document.querySelector('#save-file-select');
const dataSource = document.querySelector('#input-data-select');
const countpassCounter = document.querySelector('#countpass-counter');
Storage.setItem('dataSourceOption', dataSource?.options[dataSource?.selectedIndex]?.value);
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
submitBtn?.setAttribute('disabled', 'true');
/*****************************************************************************************************************/
/*----------------------------------------- SEPARATE EVENT LISTENERS --------------------------------------------*/
/*****************************************************************************************************************/
const dbConnectBtn = document.querySelector('#db-connect');
window.addEventListener('load', () => {
    if (sessionStorage.getItem('login') === null) {
        //LoginWindow();
    }
    Storage.setItem('inputFields', [
        document.querySelector('#filter-input-1'),
        document.querySelector('#filter-input-2'),
        document.querySelector('#filter-input-3'),
        document.querySelector('#filter-input-4'),
        document.querySelector('#filter-input-5')
    ]);
    Storage.setItem('datalists', [
        document.querySelector('#datalist-1'),
        document.querySelector('#datalist-2'),
        document.querySelector('#datalist-3'),
        document.querySelector('#datalist-4'),
        document.querySelector('#datalist-5')
    ]);
    const dbSelectors = [
        document.querySelector('#db-select-1'),
        document.querySelector('#db-select-2'),
        document.querySelector('#db-select-3'),
        document.querySelector('#db-select-4'),
        document.querySelector('#db-select-5'),
    ];
    Storage.setItem('dbSelects', [...dbSelectors]);
});
dbConnectBtn?.addEventListener('click', async () => {
    try {
        Storage.setItem('data', await fetchData('/load-fetch'));
        submitBtn?.setAttribute('disabled', 'true');
        if (Storage.items.data) {
            const dbConnectionDiv = document.querySelector('#db-connect-div');
            if (document.querySelector('#connection-check'))
                document.querySelector('#connection-check')?.remove();
            if (document.querySelector('#connection-error'))
                document.querySelector('#connection-error')?.remove();
            const connectionCheckHTML = `
            <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
         `;
            dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);
            fillStorage();
            submitBtn?.click();
        }
    }
    catch (err) {
        const dbConnectionDiv = document.querySelector('#db-connect-div');
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
});
dbConnectBtn?.removeEventListener('click', () => { });
dataSource?.addEventListener('change', () => {
    Storage.setItem('dataSourceOption', dataSource.options[dataSource.selectedIndex].value);
    const fileInputSection = document.querySelector('#file-input-section');
    if (Storage.items.dataSourceOption === 'Datei') {
        fileInputSection?.setAttribute('innerHTML', '');
        const html = `
         <select id="delimiter-selection">
            <option id="delimiter-selection-option">,</option>
            <option id="delimiter-selection-option">;</option>
         </select>

         <label id="fc" for="file-choose">Datei öffnen</label>
         <input type="file" id="file-choose"><br>
         <p id="chosen-file"></p>
      `;
        fileInputSection?.insertAdjacentHTML('beforeend', html);
        const file = document.querySelector('#file-choose');
        const chosenFile = document.querySelector('#chosen-file');
        if (file && file.files && file.files.length > 0) {
            file?.addEventListener('input', () => {
                // As file inputted, submit button become active and clickable
                submitBtn?.setAttribute('disabled', 'true');
                /**
             * Receive file name and put it to the site
             */
                const arrFromFileName = file?.value.replaceAll('\\', ',').split(',');
                chosenFile?.setAttribute('innerHTML', arrFromFileName[arrFromFileName.length - 1]);
                // FileReader will read file data as text
                const fileReader = new FileReader();
                /**
             *  file.files - object that contains data about the file from input
             *  file.files[0] - file name
            */
                fileReader.addEventListener('load', (e) => {
                    /**
                * e.target.result returns the whole data from the file. In this case in text
                * After text received, it stores in the Storage as inputText
                */
                    const target = e.target;
                    const text = target?.result;
                    Storage.setItem('inputText', text);
                    const delimiterSelection = document.querySelector('#delimiter-selection');
                    const delimiterOption = delimiterSelection?.options[delimiterSelection?.selectedIndex]?.value;
                    /**
                    * Data will be stored as a result object[] from .csv text
                    */
                    Storage.setItem('data', CsvToArray(Storage.items.inputText, delimiterOption).filter((obj) => {
                        return !Object.values(obj).includes(undefined);
                    }));
                    fillStorage();
                });
                fileReader.removeEventListener('load', (e) => { });
                // Set fileReader to read data from .csv file as text
                if (file.files)
                    fileReader.readAsText(file.files[0]);
            });
            file.removeEventListener('input', (e) => { });
        }
    }
    else if (Storage.items.dataSourceOption === 'Datenbank') {
        fileInputSection?.setAttribute('innerHTML', '');
        dataTable?.setAttribute('innerHTML', '');
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
        const dbConnectBtn = document.querySelector('#db-connect');
        const dbConnectionDiv = document.querySelector('#db-connect-div');
        dbConnectBtn?.addEventListener('click', async () => {
            try {
                await DBQuery();
                submitBtn?.setAttribute('disabled', 'false');
                const connectionCheckHTML = `
               <i class="fa-solid fa-check fa-2xl" style="color: #00b336;" id="connection-check"></i>
            `;
                dbConnectionDiv?.insertAdjacentHTML('beforeend', connectionCheckHTML);
                fillStorage();
            }
            catch (err) {
                console.log(err);
            }
        });
        dbConnectBtn?.removeEventListener('click', () => { });
    }
});
dataSource?.removeEventListener('change', () => { });
const file = document.querySelector('#file-choose');
const chosenFile = document.querySelector('#chosen-file');
if (file) {
    /**
    * Event listens file on input to receive input data from the file
    */
    file.addEventListener('input', () => {
        // As file inputted, submit button become active and clickable
        submitBtn?.setAttribute('disabled', 'false');
        /**
       * Receive file name and put it to the site
       */
        const arrFromFileName = file.value.replaceAll('\\', ',').split(',');
        chosenFile?.setAttribute('innerHTML', arrFromFileName[arrFromFileName.length - 1]);
        // FileReader will read file data as text
        const fileReader = new FileReader();
        /**
       *  file.files - object that contains data about the file from input
       *  file.files[0] - file name
      */
        fileReader.addEventListener('load', (e) => {
            /**
          * e.target.result returns the whole data from the file. In this case in text
          * After text received, it stores in the Storage as inputText
          */
            const text = e.target?.result;
            Storage.setItem('inputText', text);
            fillStorage();
        });
        fileReader.removeEventListener('load', (e) => { });
        // Set fileReader to read data from .csv file as text
        if (file.files)
            fileReader.readAsText(file.files[0]);
    });
    file.removeEventListener('input', (e) => { });
}
// listens to the first date change to change number of rows that will be outputed
document.querySelector('#left-date-inp')?.addEventListener('change', async (e) => {
    // opt - one of the keys [tLogIn, tLogOut, tLastAcc]
    const select = document?.querySelector('#date-params');
    const opt = select?.options[select?.selectedIndex]?.value;
    if (Storage.items.secondDate.value === '') {
        /**
       * Looks for the latest date
       * takes first object's key opt as initial value and checks if next is bigger or not
       */
        if (Storage.items.secondDate.value === '') {
            if (opt) {
                const latestDate = Storage.items.data.reduce((latest, current) => {
                    const currentDate = new Date(current[opt]);
                    return currentDate > latest ? currentDate : latest;
                }, new Date(Storage.items.data[0][opt]));
                const rightDateInput = document.querySelector('#right-date-inp');
                if (rightDateInput) {
                    rightDateInput.value = latestDate.toISOString().slice(0, 16);
                }
            }
        }
    }
    Storage.setItem('data', getFilters());
    rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
    let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
    Storage.items.datalists.forEach((datalist) => {
        datalist.innerHTML = '';
        dropdownValues?.values.forEach((value) => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
        });
    });
    dropdownValues = null;
});
// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp')?.addEventListener('change', async (e) => {
    const select = document.querySelector('date-params');
    const opt = select?.options[select?.selectedIndex]?.value;
    if (Storage.items.secondDate.value === '') {
        if (opt) {
            const latestDate = Storage.items.data.reduce((latest, current) => {
                const currentDate = new Date(current[opt]);
                return currentDate < latest ? currentDate : latest;
            }, new Date(Storage.items.data[0][opt]));
            const rightDateInput = document.querySelector('#left-date-inp');
            if (rightDateInput) {
                rightDateInput.value = latestDate.toISOString().slice(0, 16);
            }
        }
    }
    Storage.setItem('data', getFilters());
    rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
    let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
    Storage.items.datalists.forEach((datalist) => {
        datalist.innerHTML = '';
        dropdownValues?.values.forEach((value) => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
        });
    });
    dropdownValues = null;
});
saveSelector?.addEventListener('change', () => {
    Storage.setItem('saveOption', saveSelector.options[saveSelector.selectedIndex].value);
    PopUpHeadersSelect();
});
saveSelector?.removeEventListener('change', () => { });
/**
 * Save button needs to save current object[]/table state / filters / headers / filters w/ headers to the file
 * Storage.items.filters will mean filters that sorted initial array to the current state
 */
saveButton?.addEventListener('click', async () => {
    Storage.setItem('RefinedData', [[...Storage.items.allHeaders]]);
    Storage.items.data.forEach((obj) => {
        let arr = Storage.items.RefinedData;
        arr?.push(obj);
        Storage.setItem('RefinedData', arr);
        arr = null;
    });
    if (Storage.items.saveOption === 'Table') {
        let csvContent = '';
        Storage.items.RefinedData.forEach((row) => {
            csvContent += Object.values(row).join(',') + '\n';
        });
        Storage.setItem('csvContent', csvContent);
        Storage.setItem('fileType', 'Table');
        csvContent = null;
    }
    else if (Storage.items.saveOption === 'Headers') {
        Storage.setItem('csvContent', '');
        Storage.setItem('jsonContent', JSON.stringify(Storage.items.selectedHeaders, null, 4));
        Storage.setItem('fileType', 'Headers');
    }
    else if (Storage.items.saveOption === 'Filters') {
        Storage.setItem('csvContent', '');
        const filters = Storage.items.inputFields.map((input) => {
            if (input && input.value !== '')
                return input.value;
        }).filter((input) => input !== undefined);
        Storage.setItem('jsonContent', JSON.stringify(filters, null, 4));
        Storage.setItem('fileType', 'Filters');
    }
    else if (Storage.items.saveOption === 'Headers & Filters') {
        Storage.setItem('csvContent', '');
        const filters = Storage.items.inputFields.map((input) => {
            if (input.value !== '')
                return input.value;
        }).filter((input) => input !== undefined);
        let jsonContent = {};
        jsonContent = { ...jsonContent, headers: Storage.items.selectedHeaders };
        jsonContent = { ...jsonContent, filters: filters };
        Storage.setItem('jsonContent', JSON.stringify(jsonContent, null, 4));
        Storage.setItem('fileType', 'Headers-and-filters');
    }
    Storage.items.csvContent === ''
        ? Storage.setItem('blob', new Blob([Storage.items.jsonContent], { type: 'application/json' }))
        : Storage.setItem('blob', new Blob([Storage.items.csvContent], { type: 'text/csv; charset=utf-8' }));
    const objUrl = URL.createObjectURL(Storage.items.blob);
    saveButton.setAttribute('href', objUrl);
    const dateNow = new Date();
    saveButton.setAttribute('download', `${Storage.items.fileType}-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`);
    delete Storage.items.RefinedData;
});
saveButton?.removeEventListener('click', async () => { });
/**
 * On click reset all input fields will be cleared and number of rows will be static data length
 */
resetBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    document.querySelector('#filter-input-1')?.setAttribute('value', '');
    document.querySelector('#filter-input-2')?.setAttribute('value', '');
    document.querySelector('#filter-input-3')?.setAttribute('value', '');
    document.querySelector('#filter-input-4')?.setAttribute('value', '');
    document.querySelector('#filter-input-5')?.setAttribute('value', '');
    Storage.items.firstDate.value = '';
    Storage.items.secondDate.value = '';
    document.querySelector('#db-select-1')?.setAttribute('selectedIndex', '0');
    document.querySelector('#db-select-2')?.setAttribute('selectedIndex', '0');
    document.querySelector('#db-select-3')?.setAttribute('selectedIndex', '0');
    document.querySelector('#db-select-4')?.setAttribute('selectedIndex', '0');
    document.querySelector('#db-select-5')?.setAttribute('selectedIndex', '0');
    Storage.items.dataSourceOption === 'Datenbank'
        ? await fetchData('/load-fetch')
        : Storage.setItem('data', [...Storage.items.staticData]);
    rowsAmount?.setAttribute('innerHTML', Storage.items.staticDataLength);
    Storage.items.datalists.forEach((datalist) => {
        datalist.innerHTML = '';
        Storage.items.allValues.values.forEach((value) => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
        });
    });
});
resetBtn?.removeEventListener('click', async (e) => { });
/**
 * Eraser for dates input fields
 * On click will erase value from the date input fields and calculate amount of rows that will be outputted
 */
document?.querySelector('#date-input')?.addEventListener('click', async (e) => {
    const target = e.target;
    if (target.id.substring(0, 6) === 'eraser') {
        const targetId = target.id.slice(7);
        parseInt(targetId) === 6
            ? document.querySelector('#left-date-inp')?.setAttribute('value', '')
            : document.querySelector('#right-date-inp')?.setAttribute('value', '');
        Storage.items.dataSourceOption === 'Datenbank'
            ? await DBQuery()
            : Storage.setItem('data', getFilters());
        Storage.items.data.length === 0
            ? rowsAmount?.setAttribute('innerHTML', '0')
            : rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
        let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
        Storage.items.datalists.forEach((datalist) => {
            datalist.innerHTML = '';
            dropdownValues?.values.forEach((value) => {
                const option = document.createElement('option');
                option.className = 'datalist-option';
                option.value = value;
                datalist.appendChild(option);
            });
        });
        dropdownValues = null;
    }
});
document.querySelector('#date-input')?.removeEventListener('click', (e) => { });
/**
 * Erasers for filters
 * Will erase value from the input field next to the eraser that has been pressed
 * + Will calculate amount of rows that will be outputted
 * + Will update array and fill dropdowns with values from the updated array
 */
filters?.addEventListener('click', async (e) => {
    const target = e.target;
    if (target?.id.substring(0, 6) === 'eraser') {
        const targetId = target?.id.slice(7);
        Storage.items.inputFields[+targetId - 1].value = '';
        Storage.items.dbSelects[+targetId - 1].selectedIndex = 0;
        Storage.items.dataSourceOption === 'Datenbank'
            ? await DBQuery()
            : Storage.setItem('data', getFilters());
        Storage.items.data.length === 0
            ? rowsAmount?.setAttribute('innerHTML', '0')
            : rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
        let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
        Storage.items.datalists.forEach((datalist) => {
            datalist.innerHTML = '';
            dropdownValues?.values.forEach((value) => {
                const option = document.createElement('option');
                option.className = 'datalist-option';
                option.value = value;
                datalist.appendChild(option);
            });
        });
        dropdownValues = null;
    }
});
filters?.removeEventListener('click', async (e) => { });
filters?.addEventListener('click', async (e) => {
    const target = e.target;
    const targetId = target.id;
    const targetNumber = targetId.slice(-1);
    const targetField = document.querySelector(`#filter-input-${targetNumber}`);
    let dropdownValues;
    if (targetField) {
        targetField.addEventListener('change', async () => {
            dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
            const selectedValue = targetField.value;
            const selectedValueHeader = dropdownValues?.valueToHeaderMap[selectedValue];
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
            }
            else {
                Storage.setItem('data', getFilters());
            }
            dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
            Storage.items.datalists.forEach((datalist) => {
                datalist.innerHTML = '';
                dropdownValues?.values.forEach((value) => {
                    const option = document.createElement('option');
                    option.className = 'datalist-option';
                    option.value = value;
                    datalist.appendChild(option);
                });
            });
            dropdownValues = null;
            Storage.items.data.length === 0
                ? rowsAmount?.setAttribute('innerHTML', '0')
                : rowsAmount?.setAttribute('innerHTML', String(Storage.items.data.length));
        });
        targetField.removeEventListener('change', async () => { });
    }
});
filters?.removeEventListener('click', async (e) => { });
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/
/**
 * Main listener
 */
inputForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Call Diagram and Summary Table functions to be able to use it
    Diagram();
    SummaryTable();
    /**
    * Big part to change html elements opacity, disabled state, etc.
    */
    svgElement?.setAttribute('innerHTML', '');
    svgDiv?.setAttribute('display', 'none');
    diagrammDescription?.setAttribute('display', 'none');
    resetBtn?.setAttribute('style', 'display: none;');
    fullTableBtn?.setAttribute('style', 'display: none;');
    SummaryTableInput?.setAttribute('style', 'display: none;');
    pieDiagrammInput?.setAttribute('style', 'display: none;');
    submitBtn?.setAttribute('style', 'display: none;');
    pieDiagrammInput?.setAttribute('checked', 'true');
    saveDiv?.setAttribute('style', 'display: 0;');
    realRowsNumber?.setAttribute('style', 'display: 0;');
    shownRowsCounter?.setAttribute('style', 'display: 0;');
    shownRowsCounterDiv?.setAttribute('style', 'display: 0;');
    modeLabel?.setAttribute('style', 'display: 0;');
    saveDiv?.setAttribute('style', 'transition: 0.2s;');
    fullTable?.setAttribute('innerHTML', '');
    emptyMessage?.setAttribute('innerHTML', '');
    arrows?.setAttribute('style', 'opacity: 0');
    clickToggler?.setAttribute('style', 'display: none');
    saveButton?.setAttribute('style', 'display: none');
    dataTable?.setAttribute('innerHTML', '');
    reloadTable?.setAttribute('disabled', 'true');
    // Creating table, thead and tbody for the main data table
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    // Let user know if file is empty
    if (Storage.items.inputTextLength.length === 0) {
        if (file && file.DOCUMENT_NODE > 0)
            dataTable?.setAttribute('innerHTML', '');
    }
    else {
        realRowsNumber?.setAttribute('style', 'opacity: 1;');
        shownRowsCounter?.setAttribute('style', 'opacity: 1;');
        shownRowsCounterDiv?.setAttribute('style', 'opacity: 1;');
        modeLabel?.setAttribute('style', 'opacity: 1;');
        clickToggler?.setAttribute('style', 'display: block;`');
        saveButton?.setAttribute('style', 'display: block;');
        countpassCounter?.setAttribute('innerHTML', '0');
        /*----------------------------------------------------------------------------------------------------------------*/
        /*----------------------------------------------------------------------------------------------------------------*/
        /*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
        /*----------------------------------------------------------------------------------------------------------------*/
        /*----------------------------------------------------------------------------------------------------------------*/
        const select = document.querySelector('#date-params');
        const opt = select?.options[select?.selectedIndex]?.value;
        /**
       * Check if one the datetime-local input field is empty, second datetime-local input field will be filled
       * with the earliest or the latest date
       *
       * toISOString() is a method in JavaScript that is used to convert a date object to a string in ISO format.
       * The term "ISO" stands for "International Organization for Standardization,"
       */
        if (Storage.items.firstDate.value !== '' && Storage.items.secondDate.value === '') {
            if (opt) {
                const latestDate = Storage.items.data.reduce((latest, current) => {
                    const currentDate = new Date(current[opt]);
                    return currentDate > latest ? currentDate : latest;
                }, new Date(Storage.items.data[0][opt]));
                const rightDateInput = document.querySelector('#right-date-inp');
                if (rightDateInput) {
                    rightDateInput.value = latestDate.toISOString().slice(0, 16);
                }
            }
        }
        else if (Storage.items.firstDate.value === '' && Storage.items.secondDate.value !== '') {
            if (opt) {
                const latestDate = Storage.items.data.reduce((latest, current) => {
                    const currentDate = new Date(current[opt]);
                    return currentDate < latest ? currentDate : latest;
                }, new Date(Storage.items.data[0][opt]));
                const rightDateInput = document.querySelector('#left-date-inp');
                if (rightDateInput) {
                    rightDateInput.value = latestDate.toISOString().slice(0, 16);
                }
            }
        }
        Storage.items.dataSourceOption === 'Datenbank'
            ? await DBQuery()
            : Storage.setItem('data', getFilters());
        // Number of the rows that will be outputted
        Storage.items.data.length === 0
            ? rowsAmount?.setAttribute('innerHTML', '0')
            : rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
        // Fullfilling dropdowns
        let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
        Storage.items.datalists.forEach((datalist) => {
            datalist.innerHTML = '';
            dropdownValues?.values.forEach((value) => {
                const option = document.createElement('option');
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
        dataTable?.setAttribute('innerHTML', '');
        const innerTable = document.createElement('table');
        innerTable.innerHTML = '';
        table.appendChild(thead);
        table.appendChild(tbody);
        document.querySelector('data-table')?.appendChild(table);
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
        shownRowsCounter?.setAttribute('innerHTML', `${Storage.items.limiter}`);
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
            Storage.items.tableHeaders.forEach((header, j) => {
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
        table.addEventListener('click', async (e) => {
            const clickOption = cellSelect?.options[cellSelect?.selectedIndex].value;
            const target = e.target;
            if (target.tagName === 'BLOCKQUOTE' || target.tagName === 'TD') {
                /**
             * ClickOption is select html elment placed left-top from the table
             *
             * If clickOption is add to filters , so by clicking on any of the cells,
             * value from the cell will be added to the input field
             */
                if (clickOption === 'Add to filters' || clickOption === 'Zum Filtern hinzufügen') {
                    if (target.innerHTML.slice(target.innerHTML.indexOf('>') + 1, target.innerHTML.indexOf('</')) !== '') {
                        const blockquotes = document.querySelectorAll('td blockquote');
                        blockquotes?.forEach((blockquote, key, parent) => {
                            blockquote.contentEditable = 'false';
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
                            const select = document.querySelector('#date-params');
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
                            const emptyFieldIndexes = Storage.items.inputFields.map((filter, index) => {
                                if (filter.value === '')
                                    return index;
                            }).filter((filter) => filter !== undefined);
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
                        Storage.items.data.length === 0
                            ? rowsAmount?.setAttribute('innerHTML', '0')
                            : rowsAmount?.setAttribute('innerHTML', Storage.items.data.length);
                        let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
                        Storage.items.datalists.forEach((datalist) => {
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
          * If clickOption is show row, then clicking on any of the cells in one row,
          * the full row will be opened that contains more than 16 columns.
          * They are divided by 5 columns each
          */
            else if (clickOption === 'Show row' || clickOption == 'Zeile anzeigen') {
                const blockquotes = document.querySelectorAll('td blockquote');
                blockquotes?.forEach((blockquote, key, parent) => {
                    blockquote.contentEditable = 'false';
                });
                reloadTable?.setAttribute('disabled', 'false');
                submitBtn?.setAttribute('disabled', 'true');
                resetBtn?.setAttribute('disabled', 'true');
                fullTableBtn?.setAttribute('disabled', 'true');
                SummaryTableInput?.setAttribute('disabled', 'true');
                pieDiagrammInput?.setAttribute('disabled', 'true');
                /**
             * As we have id on each of the cells as `cell row0col0`,
             * we can find out target id by slicing from w + 1 to col, to receive just a number
             */
                const targetId = target.id;
                const row = targetId.slice(targetId.indexOf('w') + 1, targetId.indexOf('col'));
                // Recive the whole object by row number
                const object = Storage.items.data[row];
                dataTable?.setAttribute('innerHTML', '');
                const rowTable = document.createElement('table');
                rowTable.setAttribute('id', 'rowTable');
                const allHeaders = [];
                const allValues = [];
                /**
             * allHeaders will contain ALL headers from the object
             * allValues will contain ALL values from the object
             */
                for (const [key, value] of Object.entries(object)) {
                    allHeaders.push(key);
                    allValues.push(value);
                }
                /**
             * Table divides columns by 9
             */
                const divideArrByNine = (arr) => {
                    const resultArr = [];
                    for (let i = 0; i < 3; i++) {
                        const innerArr = [];
                        for (let j = 0; j < 9; j++) {
                            innerArr.push(arr[i * 9 + j]);
                        }
                        resultArr.push(innerArr);
                    }
                    return resultArr;
                };
                const resArr = [];
                for (let i = 0; i < 3; i++) {
                    resArr.push(divideArrByNine(allHeaders)[i], divideArrByNine(allValues)[i]);
                }
                for (let i = 0; i < 6; i++) {
                    const tr = document.createElement('tr');
                    for (let j = 0; j < 9; j++) {
                        const td = document.createElement('td');
                        td.innerHTML = resArr[i][j];
                        tr.appendChild(td);
                    }
                    tbody.appendChild(tr);
                }
                rowTable.append(tbody);
                dataTable?.append(rowTable);
                object.length = 0;
            }
            else if (clickOption === 'Change cell value' || clickOption === 'Den Wert einer Zelle ändern') {
                const blockquotes = document.querySelectorAll('td blockquote');
                blockquotes?.forEach((blockquote, key, parent) => {
                    blockquote.contentEditable = 'false';
                });
                Storage.setItem('blockquoteEditValue', '');
                const blockquoteId = target.id.slice(target.id.indexOf('r'), target.id.length);
                const rowId = blockquoteId.slice(blockquoteId.indexOf('w') + 1, blockquoteId.indexOf('c'));
                const colId = blockquoteId.slice(blockquoteId.indexOf('col') + 3, blockquoteId.length);
                const targetLogID = Storage.items.data[rowId]['LogID'];
                const blockquote = document.querySelector(`#blockquote-${blockquoteId}`);
                blockquote?.addEventListener('focusout', e => {
                    Storage.setItem('blockquoteEditValue', blockquote.textContent);
                    const targetObject = Storage.items.staticData.find((obj) => obj['LogID'] === targetLogID);
                    const targetKey = Storage.items.objectKeysMap.get(`${colId}`);
                    Storage.items.staticData[Storage.items.staticData.indexOf(targetObject)][targetKey] = Storage.items.blockquoteEditValue;
                    delete Storage.items.blockquoteEditValue;
                });
            }
        });
        table.removeEventListener('click', async (e) => { });
    }
});
inputForm?.removeEventListener('submit', async (e) => { });
