'use strict';

import { showFullTable } from '../Functions/ShowFullTable.js';
import csvToArray from '../Functions/CsvConvert.js';
import getFilters from '../Functions/GetFilters.js';
import datePlusMinus from '../Functions/DatePlusMinus.js';
import summaryRowToggle from '../Functions/SummaryRow.js';
import { getAllValues } from '../Functions/GetAllValues.js';
import DataPie from '../Functions/DataPie.js';

import { CustomStorage, SecondaryStorage } from '../Functions/CustomStorage.js';
const Storage = new CustomStorage();
const MinorStorage = new SecondaryStorage();

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

const summaryRowToggleInput = document.querySelector('#summary-row-toggler-input');
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox');
const svgDiv = document.querySelector('#svg-div');
const diagrammDescription = document.querySelector("#diagramm-description");
const svgElement = document.querySelector('#svg-element');

const modeLabel = document.querySelector('#mode-label');

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

submitBtn.disabled = true;
/*
document.querySelector('#left-date-inp').value = '2022-01-01'
document.querySelector('#right-date-inp').value = '2022-01-03'
*/

saveButton.addEventListener('click', () => {
   MinorStorage.editCore('CsvData', getFilters());
   MinorStorage.editCore('RefinedData', [[...Storage.core.allHeaders]]);

   if (saveFiltersOption.checked === true) {
      let filtersValues = [];

      filtersValues = Storage.core.inputFields.map(field => field.value);
      filtersValues = filtersValues.filter(value => value !== '');

      let headers = MinorStorage.core.RefinedData[0];
      let arr = MinorStorage.core.CsvData;

      if (!headers.includes('#'));
      headers.unshift('#');

      if (filtersValues.length > 0)
         headers.unshift(filtersValues);

      headers = headers.flat(Infinity);

      arr[0] = headers;

      MinorStorage.editCore('CsvData', arr);

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


file.addEventListener('input', e => {
   e.preventDefault();

   submitBtn.disabled = false;

   const arrFromFileName = file.value.replaceAll('\\', ',').split(',');

   chosenFile.innerHTML = arrFromFileName[arrFromFileName.length - 1];

   const fileReader = new FileReader();
   const inputFileData = file.files[0];

   fileReader.addEventListener('load', (e) => {
      let text = e.target.result;
      Storage.editCore('inputText', text);

      const tableHeaders = ["ProdCode", "Customer", "ProdName", "HostName", "MatNum", "ArticleNum", "WkStNmae", "AdpNum", "ProcName", "AVO", 'FPY', 'CountPass', 'CountFail', 'tLogIn', 'tLogOut', 'tLastAcc'];
      Storage.editCore('tableHeaders', tableHeaders)

      const delimiterOption = delimiterSelection.options[delimiterSelection.selectedIndex].value;

      Storage.editCore('changableArray', csvToArray(Storage.core.inputText, delimiterOption)[0].filter((obj, index) => {
         return !Object.values(obj).includes(undefined);
      }));

      Storage.editCore('staticDataArray', Storage.core.changableArray);
      Storage.editCore('allHeaders', Object.keys(Storage.core.staticDataArray[0]));
      Storage.editCore('staticDataArrayLength', Storage.core.staticDataArray.length);
      Storage.editCore('headers', csvToArray(Storage.core.inputText, delimiterOption)[1]);
      Storage.editCore('filters', csvToArray(Storage.core.inputText, delimiterOption)[2]);
      Storage.editCore('allValues', getAllValues(Storage.core.staticDataArray, Storage.core.tableHeaders));
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

      rowsAmount.innerHTML = Storage.core.changableArray.length;

      delete Storage.core.inputText;


   })
   fileReader.removeEventListener('load', (e) => { });

   fileReader.readAsText(inputFileData);
})
file.removeEventListener('input', (e) => { });

reset.addEventListener('click', e => {
   e.preventDefault();

   document.querySelector('#filter-input-1').value = '';
   document.querySelector('#filter-input-2').value = '';
   document.querySelector('#filter-input-3').value = '';
   document.querySelector('#filter-input-4').value = '';
   document.querySelector('#filter-input-5').value = '';
   rowLimiter.value = '';
   Storage.core.firstDate.value = '';
   Storage.core.secondDate.value = '';

   Storage.editCore('changableArray', [...Storage.core.staticDataArray]);

   rowsAmount.innerHTML = Storage.core.staticDataArrayLength;

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

filters.addEventListener('click', e => {
   if (e.target.id.substring(0, 6) === 'eraser') {
      const targetId = e.target.id.slice(7);
      Storage.core.inputFields[targetId - 1].value = '';

      Storage.editCore('changableArray', getFilters());
      Storage.core.changableArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.changableArray.length;

      const values = getAllValues(Storage.core.changableArray, Storage.core.tableHeaders);

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

   targetField.addEventListener('change', () => {
      Storage.editCore('changableArray', getFilters());
      let values = getAllValues(Storage.core.changableArray, Storage.core.tableHeaders);

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
      Storage.core.changableArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.changableArray.length;
   })
})

filters.removeEventListener('click', (e) => { });

inputForm.addEventListener("submit", (e) => {
   e.preventDefault();

   DataPie();
   summaryRowToggle();
   datePlusMinus();

   svgElement.innerHTML = '';

   svgDiv.style.display = 'none';
   diagrammDescription.style.display = 'none';

   resetBtn.disabled = false;
   fullTableBtn.disabled = false;
   summaryRowToggleInput.disabled = false;
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

   if (file.value == '') {
      emptyMessage.innerHTML = "Datei nicht ausgewählt";

      dataTable.innerHTML = '';
   }

   Storage.editCore('changableArray', getFilters());
   /*
   if (Storage.core.changableArray.length > 8000) {
      dataTable.innerHTML = '';

      emptyMessage.innerHTML = 'Table is too big. Please add dates or filters';
   }
   */
   //else {
      load.style.opacity = '1';
      loadingMessage.style.opacity = '1';
      load.style.transition = '0.2s';
      loadingMessage.style.transition = '0.2s';

      reloadTable.disabled = true;

      let table = document.createElement("table");
      let thead = document.createElement("thead");
      let tbody = document.createElement("tbody");

      const arrFromFileName = file.value.replaceAll('\\', ',').split(',');

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

         let limiter = 100;
         shownRowsCounter.innerHTML = `${limiter}`;

         /*----------------------------------------------------------------------------------------------------------------*/
         /*----------------------------------------------------------------------------------------------------------------*/
         /*---------------------------------------    PROGRAM ENTRY POINT    ----------------------------------------------*/
         /*----------------------------------------------------------------------------------------------------------------*/
         /*----------------------------------------------------------------------------------------------------------------*/

         Storage.editCore('changableArray', getFilters());

         let filtersFromCsvFile = Storage.core.filters;
         let filtersFromCsvFileSplitted = filtersFromCsvFile.split(',').filter(elem => elem !== '');

         filtersFromCsvFileSplitted.forEach((value, index) => {
            Storage.core.inputFields[index].setAttribute('placeholder', value);
         })

         Storage.core.changableArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.changableArray.length;

         let values = getAllValues(Storage.core.changableArray, Storage.core.tableHeaders);

         Storage.core.datalists.forEach(datalist => {
            datalist.innerHTML = '';

            values.forEach(value => {
               const option = document.createElement('option');
               option.className = 'datalist-option';
               option.value = value;
               datalist.appendChild(option);
            })
         })

         filtersFromCsvFile = null;
         filtersFromCsvFileSplitted = null;
         values = null;

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

         if (+rowLimiter.value > Storage.core.changableArray.length)
            shownRowsCounter.innerHTML = Storage.core.changableArray.length;
         else
            shownRowsCounter.innerHTML = +rowLimiter.value;

         let hrow = document.createElement('tr');
         for (let i = 0, len = Storage.core.tableHeaders.length; i < len; i++) {
            let theader = document.createElement('th');
            theader.innerHTML = Storage.core.tableHeaders[i];
            hrow.appendChild(theader);
         }
         thead.appendChild(hrow);

         let fragment = document.createDocumentFragment();
         for (let i = 0, len = limiter; i < len; i++) {
            let body_row = document.createElement('tr');
            for (let j = 0, len = Storage.core.tableHeaders.length; j < len; j++) {
               let table_data = document.createElement('td');
               table_data.setAttribute('id', `cell ${i}${j}`);

               if (Storage.core.tableHeaders[j] === 'FPY') {
                  table_data.innerHTML = `${Storage.core.changableArray[i][Storage.core.tableHeaders[j]]}%`;
               } else {
                  table_data.innerHTML = Storage.core.changableArray[i][Storage.core.tableHeaders[j]];
               }

               body_row.appendChild(table_data);
            }
            fragment.appendChild(body_row);
         }
         tbody.appendChild(fragment);

         table.appendChild(thead);
         table.appendChild(tbody);
         dataTable.appendChild(table);

         saveDiv.style.opacity = '1';
         saveDiv.style.transition = '0.2s';

         showFullTable();

         table.addEventListener('click', e => {
            const clickOption = cellSelect.options[cellSelect.selectedIndex].value;

            if (clickOption === "Add to filters" || clickOption === 'Zum Filtern hinzufügen') {
               const targetCellValue = e.target.innerHTML;

               const emptyFieldIndexes = Storage.core.inputFields.map((filter, index) => {
                  if (filter.value === '')
                     return index;
               }).filter(filter => filter !== undefined);

               if (emptyFieldIndexes.length !== 0) {
                  const targetInputField = Storage.core.inputFields[emptyFieldIndexes[0]];
                  targetInputField.value = targetCellValue;
               }

               Storage.editCore('changableArray', getFilters());

               Storage.core.changableArray.length === 0 ? rowsAmount.innerHTML = 0 : rowsAmount.innerHTML = Storage.core.changableArray.length;
            }

            else if (clickOption === "Show row" || clickOption == 'Zeile anzeigen') {
               reloadTable.disabled = false;
               submitBtn.disabled = true;
               resetBtn.disabled = true;
               fullTableBtn.disabled = true;
               summaryRowToggleInput.disabled = true;
               pieDiagrammInput.disabled = true;

               const targetId = e.target.id;
               const splittedTargetId = targetId.split('');
               splittedTargetId.splice(0, 5);

               const row = +splittedTargetId[0];

               const object = Storage.core.changableArray[row];

               dataTable.innerHTML = '';
               table.innerHTML = '';
               thead.innerHTML = '';
               tbody.innerHTML = '';

               const rowTable = document.createElement('table');
               rowTable.setAttribute('id', 'rowTable');

               const allHeaders = [];
               const allValues = [];

               for (let [key, value] of Object.entries(object)) {
                  allHeaders.push(key);
                  allValues.push(value);
               }

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
               splittedTargetId.length = 0;
            }

         })

         table.removeEventListener('click', e => { });
      }
   //}
})
inputForm.removeEventListener('submit', (e) => { })
