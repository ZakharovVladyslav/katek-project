'use strict';

/* Functions import from other files */
import CompleteTable from '../Functions/Complete-table.js';
import CsvToArray from '../Functions/Convert-csv.js';
import getFilters from '../Functions/Data-filtering.js';
import SummaryTable from '../Functions/Summary-table.js';
import DropdownValues from '../Functions/Dropdown-values.js';
import Diagram from '../Functions/Diagram.js';
import { CustomStorage, SecondaryStorage } from '../Functions/Local-Storage.js';

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
const load = document.querySelector('#load');
const loadingMessage = document.querySelector('#loading-table');
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
load.style.opacity = '0';
loadingMessage.style.opacity = '0';
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
      Storage.editCore('inputText', text);

      /**
       * TableHeaders - needed for the table to print only exact columns
       * Also stores into the Storage to be able to be called later
       */
      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc'];
      Storage.editCore('tableHeaders', tableHeaders)

      /**
       * delimiterOption - in Convert-csv delimiter has delimiter by default ','
       * If selected delimiterOption will be different from the default, it will be overwritten
      */
      const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value;

      /**
       * Data will be stored as a result object[] from .csv text
       */
      Storage.editCore('data', CsvToArray(Storage.core.inputText, delimiterOption)[0].filter((obj, index) => {
         return !Object.values(obj).includes(undefined);
      }));

      // StaticData - stored to be a full version of initial array
      Storage.editCore('staticData', Storage.core.data);

      // AllHeaders - needs for reset listener to fill dropdown immediately
      Storage.editCore('allHeaders', Object.keys(Storage.core.staticData[0]));

      // StaticDataLength - stored, not to calculate length later
      Storage.editCore('staticDataLength', Storage.core.staticData.length);
      Storage.editCore('headers', CsvToArray(Storage.core.inputText, delimiterOption)[1]);

      // Filters - to let know by which keys this file has been sorted
      Storage.editCore('filters', CsvToArray(Storage.core.inputText, delimiterOption)[2]);

      // AllValues - as same as allHeaders. not to calculate later. Receives all present value from the static data
      Storage.editCore('allValues', DropdownValues(Storage.core.staticData, Storage.core.tableHeaders));

      // Stored not to keep text present as it takes lot of memory
      Storage.editCore('inputTextLength', Storage.core.inputText.length);

      Storage.editCore('firstDate', document.querySelector('#left-date-inp'));
      Storage.editCore('secondDate', document.querySelector('#right-date-inp'));

      Storage.editCore('inputFields', [
         document.querySelector('#filter-input-1'),
         document.querySelector('#filter-input-2'),
         document.querySelector('#filter-input-3'),
         document.querySelector('#filter-input-4'),
         document.querySelector('#filter-input-5')
      ]);
      Storage.editCore('datalists', [
         document.querySelector('#datalist-1'),
         document.querySelector('#datalist-2'),
         document.querySelector('#datalist-3'),
         document.querySelector('#datalist-4'),
         document.querySelector('#datalist-5')
      ]);

      const dbSelects = [
         document.querySelector('#db-select-1'),
         document.querySelector('#db-select-2'),
         document.querySelector('#db-select-3'),
         document.querySelector('#db-select-4'),
         document.querySelector('#db-select-5'),
      ]

      /**
       * dbSelects - select html elements near to input field
       * needed for db connection to define by which key database will be stored
       *
       * Is fullfilled with all column names (headers) from the file
       */
      dbSelects.forEach(select => {
         select.innerHTML = ''

         const option = document.createElement('option')
         option.className = 'database-option';
         option.value = 'Select';
         option.innerHTML = 'Select';
         select.appendChild(option)

         Storage.core.allHeaders.forEach(header => {
            const option = document.createElement('option');
            option.className = 'database-option';
            option.value = header;
            option.innerHTML = header;
            select.appendChild(option);
         })
      })

      // Number of rows of the updated array will be outputted
      rowsAmount.innerHTML = Storage.core.data.length;

      // Text will be deleted not to take memory for no reason
      delete Storage.core.inputText;

      // Values from updated file data to fullfill dropdowns only with actual values
      let values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

      Storage.core.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      values = '';
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

   if (Storage.core.secondDate.value === '') {
      /**
       * Looks for the latest date
       * takes first object's key opt as initial value and checks if next is bigger or not
       */
      const latestDate = Storage.core.data.reduce((latest, current) => {
         const currentDate = new Date(current[opt]);
         return currentDate > latest ? currentDate : latest;
      }, new Date(Storage.core.data[0][opt]));

      document.querySelector('#right-date-inp').value = latestDate.toISOString().slice(0, 16);
   }

   Storage.editCore('data', getFilters());

   rowsAmount.innerHTML = Storage.core.data.length;

   let values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

   Storage.core.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      values.forEach(value => {
         const option = document.createElement('option');
         option.className = 'datalist-option';
         option.value = value;
         datalist.appendChild(option);
      })
   })

   values = '';
})

// Logic as same as first date, but looks for the earliest date
document.querySelector('#right-date-inp').addEventListener('change', () => {
   const select = document.getElementById('date-params');
   const opt = select.options[select.selectedIndex].value;

   if (Storage.core.firstDate.value === '') {
      const earliestDate = Storage.core.data.reduce((earliest, current) => {
         const currentDate = new Date(current[opt]);
         return currentDate < earliest ? currentDate : earliest;
      }, new Date(Storage.core.data[0][opt]));

      document.querySelector('#left-date-inp').value = earliestDate.toISOString().slice(0, 16);
   }

   Storage.editCore('data', getFilters());

   rowsAmount.innerHTML = Storage.core.data.length;

   let values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

   Storage.core.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      values.forEach(value => {
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

   values = '';
})

/**
 * Save button needs to save current object[]/table state to the file
 * Storage.core.filters will mean filters that sorted initial array to the current state
 */
saveButton.addEventListener('click', () => {
   MinorStorage.editCore('CsvData', getFilters());
   MinorStorage.editCore('RefinedData', [[...Storage.core.allHeaders]]);

   // 'Save filters' - checkbox, whether to save filters or not
   if (saveFiltersOption.checked === true) {
      let filtersValues = [];

      filtersValues = Storage.core.inputFields.map(field => field.value);
      filtersValues = filtersValues.filter(value => value !== '');

      let headers = MinorStorage.core.RefinedData[0];
      let arr = MinorStorage.core.CsvData;

      // # - is a delimiter for filters as they inputted to the headers row
      if (!headers.includes('#'));
      headers.unshift('#');

      if (filtersValues.length > 0)
         headers.unshift(filtersValues);

      headers = headers.flat(Infinity);

      arr[0] = headers;

      MinorStorage.editCore('CsvData', arr);

      // Clearing memory
      arr = null;
      headers = null;
      filtersValues = null;
   }

   MinorStorage.core.CsvData.forEach(obj => {
      let arr = MinorStorage.core.RefinedData;
      arr.push(obj);

      MinorStorage.editCore('RefinedData', arr);
      arr = null;
   })

   if (JSON.stringify(MinorStorage.core.RefinedData[0]) === JSON.stringify(MinorStorage.core.RefinedData[1])) {
      let arr = MinorStorage.core.RefinedData;

      arr.shift();

      MinorStorage.editCore('RefinedData', arr);

      arr = null;
   }

   // csvContext - text for blob
   let csvContent = '';
   MinorStorage.core.RefinedData.forEach(row => {
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
   delete MinorStorage.core.RefinedData;
   delete MinorStorage.core.CsvData;
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
   Storage.core.firstDate.value = '';
   Storage.core.secondDate.value = '';

   Storage.editCore('data', [...Storage.core.staticData]);

   rowsAmount.innerHTML = Storage.core.staticDataLength;

   Storage.core.datalists.forEach(datalist => {
      datalist.innerHTML = '';

      Storage.core.allValues.forEach(value => {
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

      Storage.editCore('data', getFilters());
      Storage.core.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.data.length;

      const values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

      Storage.core.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      values = null;
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

      Storage.core.inputFields[targetId - 1].value = '';

      Storage.editCore('data', getFilters());
      Storage.core.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.data.length;

      const values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

      Storage.core.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })
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
      Storage.editCore('data', getFilters());
      let values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

      Storage.core.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      values = null;
      Storage.core.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.data.length;
   })
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
   load.style.opacity = '1';
   loadingMessage.style.opacity = '1';
   load.style.transition = '0.2s';
   loadingMessage.style.transition = '0.2s';
   saveDiv.style.transition = '0.2s';

   fullTable.innerHTML = '';
   arrows.style.opacity = '0';
   emptyMessage.innerHTML = '';

   dataTable.innerHTML = '';
   clickToggler.style.display = 'none';
   saveButton.style.display = 'none';

   load.style.opacity = '1';
   loadingMessage.style.opacity = '1';
   load.style.transition = '0.2s';
   loadingMessage.style.transition = '0.2s';

   reloadTable.disabled = true;

   // After submit, data array will be updated and prepared to the future use
   Storage.editCore('data', getFilters());

   // Creating table, thead and tbody for the main data table
   let table = document.createElement("table");
   let thead = document.createElement("thead");
   let tbody = document.createElement("tbody");

   // Let user know if file is empty
   if (Storage.core.inputTextLength.length === 0) {
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

      load.style.transition = '0.2s';
      loadingMessage.style.transition = '0.2s';
      load.style.opacity = '1';
      loadingMessage.style.opacity = '1';
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

      Storage.editCore('data', getFilters());

      const select = document.getElementById('date-params');
      const opt = select.options[select.selectedIndex].value;

      /**
       * Check if one the datetime-local input field is empty, second datetime-local input field will be filled
       * with the earliest or the latest date
       *
       * toISOString() is a method in JavaScript that is used to convert a date object to a string in ISO format.
       * The term "ISO" stands for "International Organization for Standardization,"
       */

      if (Storage.core.firstDate.value !== '' && Storage.core.secondDate.value === '') {
         const latestDate = Storage.core.data.reduce((latest, current) => {
            const currentDate = new Date(current[opt]);

            return currentDate > latest.date ? { [`${opt}`]: currentDate } : latest;
         }, Storage.core.data[0]);

         document.querySelector('#right-date-inp').value = new Date(latestDate[opt]).toISOString().slice(0, 16);
      }
      else if (Storage.core.firstDate.value === '' && Storage.core.secondDate.value !== '') {
         const earliestDate = Storage.core.data.reduce((earliest, current) => {
            const currentDate = new Date(current[opt]);

            return currentDate < earliest.date ? { [`${opt}`]: currentDate } : earliest;
         }, { [`${opt}`]: new Date(Storage.core.data[0][opt]) });

         document.querySelector('#left-date-inp').value = new Date(earliestDate[opt]).toISOString().slice(0, 16);
      }

      // Here site receives filters from the file if they're present...
      let filtersFromCsvFile = Storage.core.filters;
      let filtersFromCsvFileSplitted = filtersFromCsvFile.split(',').filter(elem => elem !== '');

      // ...and add them as placeholders
      filtersFromCsvFileSplitted.forEach((value, index) => {
         Storage.core.inputFields[index].setAttribute('placeholder', value);
      })

      // Number of the rows that will be outputted
      Storage.core.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.data.length;

      // Fullfilling dropdowns
      let values = DropdownValues(Storage.core.data, Storage.core.tableHeaders);

      Storage.core.datalists.forEach(datalist => {
         datalist.innerHTML = '';

         values.forEach(value => {
            const option = document.createElement('option');
            option.className = 'datalist-option';
            option.value = value;
            datalist.appendChild(option);
         })
      })

      // Clearing memory
      filtersFromCsvFile = null;
      filtersFromCsvFileSplitted = null;
      values = null;

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

      load.style.transition = '0s';
      loadingMessage.style.transition = '0s';
      load.style.opacity = '0';
      loadingMessage.style.opacity = '0';

      /**
       * Building a header row
       * hrow - header row, creates once as there is only 1 header row
       * theaderCell - 'th' html element that will contain header string
       * theaderCell.innerHTML will write header into 'th' html element as <th>header</th>
       */
      let hrow = document.createElement('tr');
      for (let i = 0; i < 16; i++) {
         let theaderCell = document.createElement('th');

         theaderCell.innerHTML = Storage.core.tableHeaders[i];
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
         Storage.core.data.length > +rowLimiter.value
            ? outputLimiter = +rowLimiter.value
            : outputLimiter = Storage.core.data.length;
      }
      else
         outputLimiter = Storage.core.data.length;

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
         Storage.core.tableHeaders.forEach((header, j) => {
            // Table cell <td> to write object[header] into it
            let table_data = document.createElement('td');

            // Setting id to each of the cells where first digit stands for row and the second for column
            table_data.setAttribute('id', `cell row${i}col${j}`);

            // Check if value is not NULL so it won't be printed
            if (Storage.core.data[i][header] !== 'NULL') {
               // If header is FPY then this value will be printed with %
               if (header === 'FPY')
                  table_data.innerHTML = `${Storage.core.data[i][header]}%`;
               else
                  table_data.innerHTML = `${Storage.core.data[i][header]}`;
            }

            body_row.appendChild(table_data);
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
            const targetCellValue = e.target.innerHTML;

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
               Storage.core.firstDate.value === ''
                  ? Storage.core.firstDate.value = new Date(targetCellValue).toISOString().slice(0, 16)
                  : Storage.core.secondDate.value = new Date(targetCellValue).toISOString().slice(0, 16);
            }
            else {
               /**
                * emptyFieldIndexes checks THE FIRST EMPTY input fields
                *
                * F.e. if IF1 and IF3 are used, the first empty will be IF2, so value from the cell will be added there
                * If IF1 empty, value will be added there
                */
               const emptyFieldIndexes = Storage.core.inputFields.map((filter, index) => {
                  if (filter.value === '')
                     return index;
               }).filter(filter => filter !== undefined);

               if (emptyFieldIndexes.length !== 0) {
                  const targetInputField = Storage.core.inputFields[emptyFieldIndexes[0]];
                  targetInputField.value = targetCellValue;
               }
            }

            Storage.editCore('data', getFilters());

            Storage.core.data.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.data.length;
         }

         /**
          * If clickOption is show row, then clicking on any of the cells in one row,
          * the full row will be opened that contains more than 16 columns.
          * They are divided by 5 columns each
          */
         else if (clickOption === "Show row" || clickOption == 'Zeile anzeigen') {
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
            const object = Storage.core.data[row];

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

      })

      table.removeEventListener('click', e => { });
   }
})
inputForm.removeEventListener('submit', (e) => { })
