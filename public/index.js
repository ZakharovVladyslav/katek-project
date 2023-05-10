'use strict';

/* Functions import from other files */
import CompleteTable from './src/Complete-table.js';
import CsvToArray from './src/Convert-csv.js';
import getFilters from './src/Data-filtering.js';
import SummaryTable from './src/Summary-table.js';
import DropdownValues from './src/Dropdown-values.js';
import Diagram from './src/Diagram.js';
import { CustomStorage, SecondaryStorage } from './src/Local-Storage.js';

/* Defining storage classes instances */
const Storage = new CustomStorage();
const MinorStorage = new SecondaryStorage();

/* HTML Elements import */
const inputForm = document.querySelector('#input-form');
const file = document.querySelector('#file-choose');
const submitBtn = document.querySelector('#submit-button');
const resetBtn = document.querySelector('#reset');
const dataTable = document.querySelector('#data-table');
const emptyMessage = document.querySelector('#empty-message');
const rowLimiter = document.querySelector('#row-limiter');
const chosenFile = document.querySelector('#chosen-file');
const reloadTable = document.querySelector('#reload-table');
const cellSelect = document.querySelector('#click-toggler');
const filters = document.querySelector('#filters');
const clickToggler = document.querySelector('#click-toggler');
const saveButton = document.querySelector('#save');
const rowsAmount = document.querySelector('#rows-amount');
const fullTable = document.querySelector('#full-table');
const fullTableBtn = document.querySelector('#full-table-button');
const arrows = document.querySelector('#index-arrows');
const saveFiltersOption = document.querySelector('#save-filter-option');
const saveDiv = document.querySelector('#save-div');
const delimiterSelection = document.querySelector('#delimiter-selection');
const realRowsNumber = document.querySelector('#real-rows-number');
const shownRowsCounter = document.querySelector('#shown-rows-counter');
const shownRowsCounterDiv = document.querySelector('.shown-rows-counter-div');
const fullTableSection = document.querySelector('#full-table-section');
const SummaryTableInput = document.querySelector('#summary-row-toggler-input');
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox');
const svgDiv = document.querySelector('#svg-div');
const diagrammDescription = document.querySelector("#diagramm-description");
const svgElement = document.querySelector('#svg-element');
const modeLabel = document.querySelector('#mode-label');

/* Initial styles changes for HTML Elements that will appear only after submit */
fullTableSection.style.opacity = '0';
saveDiv.style.opacity = '0';
realRowsNumber.style.opacity = '0';
shownRowsCounter.style.opacity = '0';
shownRowsCounterDiv.style.opacity = '0';
modeLabel.style.opacity = '0';
clickToggler.style.display = 'none';
saveButton.style.display = 'none';

/* If file is not inputted, submit button is not able to be pressed */
submitBtn.disabled = true;

/*****************************************************************************************************************/
/*----------------------------------------- SEPARATE EVENT LISTENERS --------------------------------------------*/
/*****************************************************************************************************************/

/**
 * Event listens file on input to receive input data from the file
 */
file.addEventListener('input', () => {
   // As file inputted, submit button become active and clickable
   submitBtn.disabled = false;

   /**
    * Receive file name and put it to the site
    */
   const arrFromFileName = file.value.replaceAll('\\', ',').split(',');

   chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1];

   // FileReader will read file data as text
   const fileReader = new FileReader();

   /**
    *  file.files - object that contains data about the file from input
    *  file.files[0] - file name
   */
   const inputFileData = file.files[0];

   fileReader.addEventListener('load', (e) => {
      /**
       * e.target.result returns the whole data from the file. In this case in text
       * After text received, it stores in the Storage as inputText
       */
      let text = e.target.result;
      Storage.setItem('inputText', text);

      /**
       * TableHeaders - needed for the table to print only exact columns
       * Also stores into the Storage to be able to be called later
       */
      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc'];
      Storage.setItem('tableHeaders', tableHeaders)

      /**
       * delimiterOption - in Convert-csv delimiter has delimiter by default ','
       * If selected delimiterOption will be different from the default, it will be overwritten
      */
      const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value;

      /**
       * Data will be stored as a result object[] from .csv text
       */
      Storage.setItem('data', CsvToArray(Storage.items.inputText, delimiterOption)[0].filter((obj, index) => {
         return !Object.values(obj).includes(undefined);
      }));

      // StaticData - stored to be a full version of initial array
      Storage.setItem('staticData', Storage.items.data);

      // AllHeaders - needs for reset listener to fill dropdown immediately
      Storage.setItem('allHeaders', Object.keys(Storage.items.staticData[0]));

      // StaticDataLength - stored, not to calculate length later
      Storage.setItem('staticDataLength', Storage.items.staticData.length);
      Storage.setItem('headers', CsvToArray(Storage.items.inputText, delimiterOption)[1]);

      // Filters - to let know by which keys this file has been sorted
      Storage.setItem('filters', CsvToArray(Storage.items.inputText, delimiterOption)[2]);

      // AllValues - as same as allHeaders. not to calculate later. Receives all present value from the static data
      Storage.setItem('allValues', DropdownValues(Storage.items.staticData, Storage.items.tableHeaders));

      // Stored not to keep text present as it takes lot of memory
      Storage.setItem('inputTextLength', Storage.items.inputText.length);

      Storage.setItem('firstDate', document.querySelector('#left-date-inp'));
      Storage.setItem('secondDate', document.querySelector('#right-date-inp'));

      const headersMap = new Map();
      Storage.items.tableHeaders.forEach((header, index) => {
         headersMap.set(`${index}`, `${header}`);
      })

      Storage.setItem('objectKeysMap', headersMap);

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
      ]

      Storage.setItem('dbSelects', [...dbSelectors]);

      /**
       * dbSelects - select html elements near to input field
       * needed for db connection to define by which key database will be stored
       *
       * Is fullfilled with all column names (headers) from the file
       */
      dbSelectors.forEach(select => {
         select.innerHTML = ''

         const option = document.createElement('option')
         option.className = 'database-option';
         option.value = 'Select';
         option.innerHTML = 'Select';
         select.appendChild(option)

         Storage.items.allHeaders.forEach(header => {
            const option = document.createElement('option');
            option.className = 'database-option';
            option.value = header;
            option.innerHTML = header;
            select.appendChild(option);
         })
      })

      // Number of rows of the updated array will be outputted
      rowsAmount.innerHTML = Storage.items.data.length;

      // Text will be deleted not to take memory for no reason
      delete Storage.items.inputText;

      // Values from updated file data to fullfill dropdowns only with actual values
      let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

      Storage.items.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         dropdownValues.values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      dropdownValues = null;
   })
   fileReader.removeEventListener('load', (e) => { });

   // Set fileReader to read data from .csv file as text
   fileReader.readAsText(inputFileData);
})
file.removeEventListener('input', (e) => { });

// listens to the first date change to change number of rows that will be outputed
document.querySelector('#left-date-inp').addEventListener('change', () => {
   // opt - one of the keys [tLogIn, tLogOut, tLastAcc]
   const select = document.getElementById('date-params');
   const opt = select.options[select.selectedIndex].value;

   if (Storage.items.secondDate.value === '') {
      /**
       * Looks for the latest date
       * takes first object's key opt as initial value and checks if next is bigger or not
       */
      const latestDate = Storage.items.data.reduce((latest, current) => {
         const currentDate = new Date(current[opt]);
         return currentDate > latest ? currentDate : latest;
      }, new Date(Storage.items.data[0][opt]));

      document.querySelector('#right-date-inp').value = latestDate.toISOString().slice(0, 16);
   }

   Storage.setItem('data', getFilters());

   rowsAmount.innerHTML = Storage.items.data.length;

   let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

   Storage.items.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      dropdownValues.values.forEach(value => {
         const option = document.createElement('option');
         option.className = 'datalist-option';
         option.value = value;
         datalist.appendChild(option);
      })
   })

   dropdownValues = null;
})

// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp').addEventListener('change', () => {
   const select = document.getElementById('date-params');
   const opt = select.options[select.selectedIndex].value;

   if (Storage.items.firstDate.value === '') {
      const earliestDate = Storage.items.data.reduce((earliest, current) => {
         const currentDate = new Date(current[opt]);
         return currentDate < earliest ? currentDate : earliest;
      }, new Date(Storage.items.data[0][opt]));

      document.querySelector('#left-date-inp').value = earliestDate.toISOString().slice(0, 16);
   }

   Storage.setItem('data', getFilters());

   rowsAmount.innerHTML = Storage.items.data.length;

   let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

   Storage.items.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      dropdownValues.values.forEach(value => {
         /*
         if (value.slice(0, 4) === '----') {
            const option = document.createElement('option');
         }
         */

         const option = document.createElement('option');
         option.className = 'datalist-option';
         option.value = value;
         datalist.appendChild(option);
      })
   })

   dropdownValues = null;
})

/**
 * Save button needs to save current object[]/table state to the file
 * Storage.items.filters will mean filters that sorted initial array to the current state
 */
saveButton.addEventListener('click', () => {
   MinorStorage.setItem('CsvData', getFilters());
   MinorStorage.setItem('RefinedData', [[...Storage.items.allHeaders]]);

   // 'Save filters' - checkbox, whether to save filters or not
   if (saveFiltersOption.checked === true) {
      let filtersValues = [];

      filtersValues = Storage.items.inputFields.map(field => field.value);
      filtersValues = filtersValues.filter(value => value !== '');

      let headers = MinorStorage.items.RefinedData[0];
      let arr = MinorStorage.items.CsvData;

      // # - is a delimiter for filters as they inputted to the headers row
      if (!headers.includes('#'));
      headers.unshift('#');

      if (filtersValues.length > 0)
         headers.unshift(filtersValues);

      headers = headers.flat(Infinity);

      arr[0] = headers;

      MinorStorage.setItem('CsvData', arr);

      // Clearing memory
      arr = null;
      headers = null;
      filtersValues = null;
   }

   MinorStorage.items.CsvData.forEach(obj => {
      let arr = MinorStorage.items.RefinedData;
      arr.push(obj);

      MinorStorage.setItem('RefinedData', arr);
      arr = null;
   })


   if (JSON.stringify(MinorStorage.items.RefinedData[0].flat(Infinity)) === JSON.stringify(MinorStorage.items.RefinedData[1].flat(Infinity))) {
      let arr = MinorStorage.items.RefinedData;

      console.log(arr);

      arr.shift();

      MinorStorage.setItem('RefinedData', arr);

      arr = null;
   }

   // csvContext - text for blob
   let csvContent = '';
   MinorStorage.items.RefinedData.forEach(row => {
      typeof (row) === 'object'
         ? csvContent += Object.values(row).join(',') + '\n'
         : csvContent += row.join(',') + '\n';
   })

   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' });
   const objUrl = URL.createObjectURL(blob);
   saveButton.setAttribute('href', objUrl);

   const dateNow = new Date();
   saveButton.setAttribute('download', `Filtered-table-${dateNow.getDate()}-${dateNow.getMonth()}-${dateNow.getFullYear()}-${dateNow.getHours()}-${dateNow.getMinutes()}-${dateNow.getSeconds()}`);

   csvContent = '';
   delete MinorStorage.items.RefinedData;
   delete MinorStorage.items.CsvData;
})
saveButton.removeEventListener('click', () => { });

/**
 * On click reset all input fields will be cleared and number of rows will be static data length
 */
reset.addEventListener('click', e => {
   e.preventDefault();

   document.querySelector('#filter-input-1').value = '';
   document.querySelector('#filter-input-2').value = '';
   document.querySelector('#filter-input-3').value = '';
   document.querySelector('#filter-input-4').value = '';
   document.querySelector('#filter-input-5').value = '';

   Storage.items.firstDate.value = '';
   Storage.items.secondDate.value = '';

   document.querySelector('#db-select-1').selectedIndex = 0;
   document.querySelector('#db-select-2').selectedIndex = 0;
   document.querySelector('#db-select-3').selectedIndex = 0;
   document.querySelector('#db-select-4').selectedIndex = 0;
   document.querySelector('#db-select-5').selectedIndex = 0;

   Storage.setItem('data', [...Storage.items.staticData]);

   rowsAmount.innerHTML = Storage.items.staticDataLength;

   Storage.items.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      Storage.items.allValues.forEach(value => {
         const option = document.createElement('option');
         option.className = 'datalist-option';
         option.value = value;
         datalist.appendChild(option);
      })
   })
})
reset.removeEventListener('click', e => { });

/**
 * Eraser for dates input fields
 * On click will erase value from the date input fields and calculate amount of rows that will be outputted
 */
document.querySelector('#date-input').addEventListener('click', e => {
   if (e.target.id.substring(0, 6) === 'eraser') {
      const targetId = e.target.id.slice(7);

      parseInt(targetId) === 6
         ? document.querySelector('#left-date-inp').value = ''
         : document.querySelector('#right-date-inp').value = '';

      Storage.setItem('data', getFilters());
      Storage.items.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.items.data.length;

      let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

      Storage.items.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         dropdownValues.values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      dropdownValues = null;
   }
})
document.querySelector("#date-input").removeEventListener('click', e => { });

/**
 * Erasers for filters
 * Will erase value from the input field next to the eraser that has been pressed
 * + Will calculate amount of rows that will be outputted
 * + Will update array and fill dropdowns with values from the updated array
 */
filters.addEventListener('click', e => {
   if (e.target.id.substring(0, 6) === 'eraser') {
      const targetId = e.target.id.slice(7);

      Storage.items.inputFields[targetId - 1].value = '';
      Storage.items.dbSelects[targetId - 1].selectedIndex = 0;

      Storage.setItem('data', getFilters());
      Storage.items.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.items.data.length;

      let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

      Storage.items.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         dropdownValues.values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      dropdownValues = null;
   }
})
filters.removeEventListener('click', e => { });

filters.addEventListener('click', (e) => {
   const targetId = e.target.id;
   const targetNumber = targetId.slice(-1);
   const targetField = document.querySelector(`#filter-input-${targetNumber}`);

   /**
    * On input field text input array will be updated with new filters
    * after text inputted dropdown values will be updated
    * + amount of outputted rows will be updated
    */
   targetField.addEventListener('change', () => {
      Storage.setItem('data', getFilters());

      let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);
      const selectedValue = targetField.value;
      const selectedValueHeader = dropdownValues.valueToHeaderMap[selectedValue];

      let targetIndex = -1;
      for (let i = 0; i < Storage.items.dbSelects[targetNumber].length; i++) {
         if (Storage.items.dbSelects[targetNumber].options[i].value === selectedValueHeader) {
            targetIndex = i;
         }
      }

      Storage.items.dbSelects[targetNumber - 1].selectedIndex = targetIndex;

      Storage.items.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         dropdownValues.values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         });
      });

      dropdownValues = null;

      Storage.items.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.items.data.length;
   });
})

filters.removeEventListener('click', (e) => { });

/*****************************************************************************************************************/
/*****************************************************************************************************************/
/*****************************************************************************************************************/

/**
 * Main listener
 */
inputForm.addEventListener("submit", (e) => {
   e.preventDefault();

   // Call Diagram and Summary Table functions to be able to use it
   Diagram();
   SummaryTable();

   /**
    * Big part to change html elements opacity, disabled state, etc.
    */
   svgElement.innerHTML = '';

   svgDiv.style.display = 'none';
   diagrammDescription.style.display = 'none';

   resetBtn.disabled = false;
   fullTableBtn.disabled = false;
   SummaryTableInput.disabled = false;
   pieDiagrammInput.disabled = false;

   pieDiagrammInput.checked = true;

   if (submitBtn.disabled)
      submitBtn.disabled = false;

   saveDiv.style.opacity = '0';
   realRowsNumber.style.opacity = '0';
   shownRowsCounter.style.opacity = '0';
   shownRowsCounterDiv.style.opacity = '0';
   modeLabel.style.opacity = '0';
   saveDiv.style.transition = '0.2s';

   fullTable.innerHTML = '';
   arrows.style.opacity = '0';
   emptyMessage.innerHTML = '';

   dataTable.innerHTML = '';
   clickToggler.style.display = 'none';
   saveButton.style.display = 'none';

   reloadTable.disabled = true;

   // After submit, data array will be updated and prepared to the future use
   Storage.setItem('data', getFilters());

   // Creating table, thead and tbody for the main data table
   let table = document.createElement("table");
   let thead = document.createElement("thead");
   let tbody = document.createElement("tbody");

   // Let user know if file is empty
   if (Storage.items.inputTextLength.length === 0) {
      if (file.DOCUMENT_NODE > 0) {
         dataTable.innerHTML = '';
         table.innerHTML = '';
         thead.innerHTML = '';
         tbody.innerHTML = '';
      }

      emptyMessage.innerHTML = `Datei <span>${arrFromFileName[arrFromFileName.length - 1]}</span> ist leer`;
   }

   else {
      if (emptyMessage.value != 0)
         emptyMessage.innerHTML = '';

      realRowsNumber.style.opacity = '1';
      shownRowsCounter.style.opacity = '1';
      shownRowsCounterDiv.style.opacity = '1';
      modeLabel.style.opacity = '1';
      clickToggler.style.display = 'block';
      saveButton.style.display = 'block';

      /*----------------------------------------------------------------------------------------------------------------*/
      /*----------------------------------------------------------------------------------------------------------------*/
      /*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
      /*----------------------------------------------------------------------------------------------------------------*/
      /*----------------------------------------------------------------------------------------------------------------*/

      Storage.setItem('data', getFilters());

      const select = document.getElementById('date-params');
      const opt = select.options[select.selectedIndex].value;

      /**
       * Check if one the datetime-local input field is empty, second datetime-local input field will be filled
       * with the earliest or the latest date
       *
       * toISOString() is a method in JavaScript that is used to convert a date object to a string in ISO format.
       * The term "ISO" stands for "International Organization for Standardization,"
       */

      if (Storage.items.firstDate.value !== '' && Storage.items.secondDate.value === '') {
         const latestDate = Storage.items.data.reduce((latest, current) => {
            const currentDate = new Date(current[opt]);

            return currentDate > latest.date ? { [`${opt}`]: currentDate } : latest;
         }, Storage.items.data[0]);

         document.querySelector('#right-date-inp').value = new Date(latestDate[opt]).toISOString().slice(0, 16);
      }
      else if (Storage.items.firstDate.value === '' && Storage.items.secondDate.value !== '') {
         const earliestDate = Storage.items.data.reduce((earliest, current) => {
            const currentDate = new Date(current[opt]);

            return currentDate < earliest.date ? { [`${opt}`]: currentDate } : earliest;
         }, { [`${opt}`]: new Date(Storage.items.data[0][opt]) });

         document.querySelector('#left-date-inp').value = new Date(earliestDate[opt]).toISOString().slice(0, 16);
      }

      // Here site receives filters from the file if they're present...
      let filtersFromCsvFile = Storage.items.filters;
      let filtersFromCsvFileSplitted = filtersFromCsvFile.split(',').filter(elem => elem !== '');

      // ...and add them as placeholders
      filtersFromCsvFileSplitted.forEach((value, index) => {
         Storage.items.inputFields[index].setAttribute('placeholder', value);
      })

      // Number of the rows that will be outputted
      Storage.items.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.items.data.length;

      // Fullfilling dropdowns
      let dropdownValues = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

      Storage.items.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         dropdownValues.values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      // Clearing memory
      filtersFromCsvFile = null;
      filtersFromCsvFileSplitted = null;
      dropdownValues = null;

      /**
       * Building a table from the data array which is object[]
       */
      dataTable.innerHTML = '';
      table.innerHTML = '';
      thead.innerHTML = '';
      tbody.innerHTML = '';

      const innerTable = document.createElement('table');
      innerTable.innerHTML = '';

      table.appendChild(thead);
      table.appendChild(tbody);

      document.getElementById('data-table').appendChild(table);

      /**
       * Building a header row
       * hrow - header row, creates once as there is only 1 header row
       * theaderCell - 'th' html element that will contain header string
       * theaderCell.innerHTML will write header into 'th' html element as <th>header</th>
       */
      let hrow = document.createElement('tr');
      for (let i = 0; i < 16; i++) {
         let theaderCell = document.createElement('th');

         theaderCell.innerHTML = Storage.items.tableHeaders[i];
         hrow.appendChild(theaderCell);
      }
      thead.appendChild(hrow);

      // OutputLimiter - defines how many table rows will be printed
      let outputLimiter;

      /**
       * IF rowLimiter input field IS NOT empty, then outputLimiter will be checked:
       *    whether it is smaller than input data size or not:
       *       if yes: outputLimiter will be size of limiter value from input field
       *       if no: outputLimiter will be sized as input data array
       * ELSE if rowLimiter input field is empty, then outputLimiter will have size of the input array
       *
       */
      if (rowLimiter.value !== '') {
         Storage.items.data.length > +rowLimiter.value
            ? outputLimiter = +rowLimiter.value
            : outputLimiter = Storage.items.data.length;
      }
      else
         outputLimiter = Storage.items.data.length;

      shownRowsCounter.innerHTML = `${outputLimiter}`;

      /**
       * Building a table
       *
       * Number of rows is limited by the outputLimiter (described above)
       */
      for (let i = 0; i < outputLimiter; i++) {
         // body_row --- <tr> in <tbody> that contains info from object
         let body_row = document.createElement('tr');

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
                        contenteditable='true'
                        id='blockquote-row${i}col${j}'
                     >${Storage.items.data[i][header]}%</blockquote>
                  </td>
                  `;
               }
               else {
                  tableDataHTML = `
                  <td id='cell-row${i}col${j}'>
                     <blockquote
                        contenteditable='true'
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
                        contenteditable='true'
                        id='blockquote-row${i}col${j}'
                     >${Storage.items.data[i][header]}</blockquote>
                  </td>
               `;
            }

            // Appending element to tbody row
            body_row.insertAdjacentHTML('beforeend', tableDataHTML);
         })
         tbody.appendChild(body_row);
      }

      table.appendChild(thead);
      table.appendChild(tbody);
      dataTable.appendChild(table);

      saveDiv.style.opacity = '1';
      saveDiv.style.transition = '0.2s';

      // Calling full table function
      CompleteTable();

      /**
       * This event handler allows user to check the whole row OR to add filters to the input field
       */
      table.addEventListener('click', e => {
         const clickOption = cellSelect.options[cellSelect.selectedIndex].value;

         /**
          * ClickOption is select html elment placed left-top from the table
          *
          * If clickOption is add to filters , so by clicking on any of the cells,
          * value from the cell will be added to the input field
          */
         if (clickOption === "Add to filters" || clickOption === 'Zum Filtern hinzufügen') {
            const blockquotes = document.querySelectorAll('td blockquote');
            blockquotes.forEach(blockquote => blockquote.contentEditable = false);

            const id = e.target.id;
            const colId = id.slice(id.indexOf('col') + 3, id.length);
            const header = Storage.items.objectKeysMap.get(`${colId}`);

            /**
             * As we have <blockquote> inside of <td>, then we need to check
             * either we clicked on <td> or <blockquote> because if we click on
             * <td> - we will receive innerHTML as <blockquote>...</blockquote>,
             * but if we clicked on blockquote directly, we will receive a cell value
             */
            let targetCellValue = '';
            e.target.id.includes('blockquote')
               ? targetCellValue = e.target.innerHTML
               // here if we click on cell we need additionaly to slice <blockquote></blockquote> to receive its innerHTML
               : targetCellValue = e.target.innerHTML.slice(e.target.innerHTML.indexOf('>') + 1, e.target.innerHTML.indexOf('</'));

            /**
             * Receiving target column by slicing from col + 3 to the end of the string
             * as our cell id has a look like `cell row0col0`
             */
            const targetCol = e.target.id.slice(e.target.id.indexOf('col') + 3, e.target.id.length);

            /**
             * Columns 13, 14 and 15 are datetime-local columns for tLogIn, tLogOut, tLastAcc
             * So if user pressed on the date cell, it has to be added to the right place
             */
            if (targetCol === '13' || targetCol === '14' || targetCol === '15') {
               const select = document.getElementById('date-params');

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
               if (targetCol in indexMap) {
                  select.selectedIndex = indexMap[targetCol];
               }

               /**
                * Check which one of the date inputs empty first, so date will be added there
                */
               Storage.items.firstDate.value === ''
                  ? Storage.items.firstDate.value = new Date(targetCellValue).toISOString().slice(0, 16)
                  : Storage.items.secondDate.value = new Date(targetCellValue).toISOString().slice(0, 16);
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
               }).filter(filter => filter !== undefined);

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

            Storage.setItem('data', getFilters());

            Storage.items.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.items.data.length;
         }

         /**
          * If clickOption is show row, then clicking on any of the cells in one row,
          * the full row will be opened that contains more than 16 columns.
          * They are divided by 5 columns each
          */
         else if (clickOption === "Show row" || clickOption == 'Zeile anzeigen') {
            const blockquotes = document.querySelectorAll('td blockquote');
            blockquotes.forEach(blockquote => blockquote.contentEditable = false);

            reloadTable.disabled = false;
            submitBtn.disabled = true;
            resetBtn.disabled = true;
            fullTableBtn.disabled = true;
            SummaryTableInput.disabled = true;
            pieDiagrammInput.disabled = true;

            /**
             * As we have id on each of the cells as `cell row0col0`,
             * we can find out target id by slicing from w + 1 to col, to receive just a number
             */
            const targetId = e.target.id;
            const row = targetId.slice(targetId.indexOf('w') + 1, targetId.indexOf('col'));

            // Recive the whole object by row number
            const object = Storage.items.data[row];

            dataTable.innerHTML = '';
            table.innerHTML = '';
            thead.innerHTML = '';
            tbody.innerHTML = '';

            const rowTable = document.createElement('table');
            rowTable.setAttribute('id', 'rowTable');

            const allHeaders = [];
            const allValues = [];

            /**
             * allHeaders will contain ALL headers from the object
             * allValues will contain ALL values from the object
             */
            for (let [key, value] of Object.entries(object)) {
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
                     innerArr.push(arr[i * 9 + j])
                  }
                  resultArr.push(innerArr);
               }

               return resultArr;
            }

            const resArr = [];
            for (let i = 0; i < 3; i++)
               resArr.push(divideArrByNine(allHeaders)[i], divideArrByNine(allValues)[i]);

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
            dataTable.append(rowTable);

            object.length = 0;
         }
         else if (clickOption === 'Change cell value' || clickOption === 'Den Wert einer Zelle ändern') {
            //const blockquotes = document.querySelectorAll('td blockquote');
            //blockquotes.forEach(blockquote => blockquote.contentEditable = true);
            Storage.setItem('blockquoteEditValue', '');

            const blockquoteId = e.target.id.slice(e.target.id.indexOf('r'), e.target.id.length);
            const rowId = blockquoteId.slice(blockquoteId.indexOf('w') + 1, blockquoteId.indexOf('c'));
            const colId = blockquoteId.slice(blockquoteId.indexOf('col') + 3, blockquoteId.length);
            const targetLogID = Storage.items.data[rowId]['LogID'];
            const blockquote = document.querySelector(`#blockquote-${blockquoteId}`);

            blockquote.addEventListener('focusout', e => {
               Storage.setItem('blockquoteEditValue', blockquote.textContent);

               const targetObject = Storage.items.staticData.find(obj => obj['LogID'] === targetLogID);
               const targetKey = Storage.items.objectKeysMap.get(`${colId}`);

               Storage.items.staticData[Storage.items.staticData.indexOf(targetObject)][targetKey] = Storage.items.blockquoteEditValue;

               delete Storage.items.blockquoteEditValue;
            });
         }

      })

      table.removeEventListener('click', e => { });
   }
})
inputForm.removeEventListener('submit', (e) => { })
