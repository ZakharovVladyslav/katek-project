'use strict';

/* Functions import from other files */
import getFilters from '../utils/Data-filtering.ts';
import DropdownValues from '../utils/Dropdown-values.ts';
import CustomStorage from '../services/Storage/CustomStorage.ts';
import DBQuery from '../utils/DBQuery.ts';
import CountpassCounter from '../utils/CountpassCounter.ts';

/* Defining storage classes instances */
const Storage: Record<string, any> = new CustomStorage();

// INTERFACES -------------------------------------------------------------------------------------
import { FullDataInterface } from '../utils/types.ts';
//-------------------------------------------------------------------------------------------------

/* HTML Elements import */

// BUTTONS ----------------------------------------------------------------------------------------
const submitBtn = document.querySelector('#submit-button') as HTMLButtonElement;
const resetBtn = document.querySelector('#reset') as HTMLButtonElement;
const reloadTable = document.querySelector('#reload-table') as HTMLButtonElement;
const fullTableBtn = document.querySelector('#full-table-button') as HTMLButtonElement;
//-------------------------------------------------------------------------------------------------

// SELECTS ----------------------------------------------------------------------------------------
const clickToggler = document.querySelector('#click-toggler') as HTMLSelectElement;
//-------------------------------------------------------------------------------------------------

// INPUTS-------------------------------------------------------------------------------------------
const SummaryTableInput = document.querySelector('#summary-row-toggler-input') as HTMLInputElement;
const pieDiagrammInput = document.querySelector('#pie-diagramm-checkbox') as HTMLInputElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const rowsAmount = document.querySelector('#rows-amount') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// TABLES------------------------------------------------------------------------------------------
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

export default async function handleTableClick(e: MouseEvent) {
    const clickOption: string | undefined = clickToggler?.options[clickToggler?.selectedIndex].value;
    const target = e.target as HTMLElement;

    if (target.tagName === 'BLOCKQUOTE' || target.tagName === 'TD') {
        /**
         * ClickOption is select html elment placed left-top from the table
         *
         * If clickOption is add to filters , so by clicking on any of the cells,
         * value from the cell will be added to the input field
         */
        if (clickOption === 'add-to-filters' && Storage.items.data.length > 1) {
            if (target.innerHTML.slice(target.innerHTML.indexOf('>') + 1, target.innerHTML.indexOf('</')) !== '') {
                const blockquotes = document.querySelectorAll('td blockquote');
                blockquotes?.forEach((blockquote: Element) => {
                    (blockquote as HTMLQuoteElement).contentEditable = 'false';
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
                    const select: HTMLSelectElement | null = document.querySelector<HTMLSelectElement>('#date-params');

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
                    const emptyFieldIndexes = Storage.items.inputFields.map((filter: HTMLInputElement, index: number) => {
                        if (filter.value === '')
                            return index;
                    }).filter((filter: HTMLInputElement) => filter !== undefined);

                    if (emptyFieldIndexes.length !== 0) {
                        const targetInputField = Storage.items.inputFields[emptyFieldIndexes[0]];
                        targetInputField.value = targetCellValue;
                        const targetInputFieldId = targetInputField.id.slice(-1);

                        const targetHeader = Storage.items.objectKeysMap.get(`${colId}`);

                        let targetIndex = -1;
                        console.log(Storage.items.dbSelects);
                        console.log(targetInputFieldId);
                        console.log(Storage.items.dbSelects[targetInputFieldId - 1]);
                        console.log(Storage.items.dbSelects[targetInputFieldId - 1].length);
                        for (let i = 0; i < Storage.items.dbSelects[targetInputFieldId - 1].length; i++) {
                            if (Storage.items.dbSelects[targetInputFieldId - 1].options[i].value === targetHeader) {
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

                if (rowsAmount) {
                    Storage.items.data.length === 0
                        ? rowsAmount.innerHTML = '0'
                        : rowsAmount.innerHTML = Storage.items.data.length;
                }

                let dropdownValues: {
                    values: string[];
                    valueToHeaderMap: object;
                } | null = DropdownValues(Storage.items.data, Storage.items.tableHeaders);

                Storage.items.datalists.forEach((datalist: HTMLDataListElement) => {
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
     * If clickOption is 'show row'	, then clicking on any of the cells in one row,
     * the full row will be opened that contains more than 16 columns.
     * They are divided by 5 columns each
     */
    if (clickOption === 'show-row') {
        if (dataTable)
            dataTable.innerHTML = '';

        const blockquotes = document.querySelectorAll('td blockquote');
        blockquotes?.forEach((blockquote: Element) => {
            (blockquote as HTMLQuoteElement).contentEditable = 'false';
        });

        if (reloadTable)
            reloadTable.disabled = false;
        if (submitBtn)
            submitBtn.disabled = true;
        if (resetBtn)
            resetBtn.disabled = true;
        if (fullTableBtn)
            fullTableBtn.disabled = true;
        if (SummaryTableInput)
            SummaryTableInput.disabled = true;
        if (pieDiagrammInput)
            pieDiagrammInput.disabled = true;

        /**
         * As we have id on each of the cells as `cell row0col0`,
         * we can find out target id by slicing from w + 1 to col, to receive just a number
         */
        const targetId = target.id;
        const row = targetId.slice(targetId.indexOf('w') + 1, targetId.indexOf('col'));

        console.log(row);

        // Recive the whole object by row number
        const object = Storage.items.data[row];

        console.log(object);

        if (dataTable)
            dataTable.innerHTML = '';

        const rowTable = document.createElement('table');
        rowTable.setAttribute('id', 'rowTable');

        const allHeaders = [];
        const allValues = [];

        /**
         * allHeaders will contain ALL headers from the object
         * allValues will contain ALL values from the object
         */
        if (!target.innerHTML.startsWith('<')) {
            for (const [key, value] of Object.entries(object)) {
                allHeaders.push(key);
                allValues.push(value);
            }
        }

        /**
         * Table divides columns by 9
         */
        const divideArrByNine = (arr: string[] | unknown[]) => {
            const resultArr: string[][] = [];

            for (let i = 0; i < 3; i++) {
                const innerArr: string[] = [];
                for (let j = 0; j < 9; j++) {
                    innerArr.push(arr[i * 9 + j] as string);
                }
                resultArr.push(innerArr);
            }

            return resultArr;
        };

        const resArr: string[][] = [];
        for (let i = 0; i < 3; i++) {
            resArr.push(
                divideArrByNine(allHeaders as string[])[i],
                divideArrByNine(allValues as string[])[i]
            );
        }

        const rowTableBody: HTMLTableSectionElement = document.createElement('tbody');

        for (let i = 0; i < 6; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < 9; j++) {
                const td = document.createElement('td');
                td.innerHTML = resArr[i][j];
                tr.appendChild(td);
            }
            rowTableBody.appendChild(tr);
        }

        console.log(rowTableBody);

        if (dataTable)
            dataTable.innerHTML = '';

        rowTable.append(rowTableBody);
        dataTable?.append(rowTable);

        if (typeof (object) === 'object')
            object.length = 0;
    }
    else if (clickOption === 'change-cell-content') {
        const blockquotes = document.querySelectorAll('td blockquote');
        blockquotes?.forEach((blockquote: Element) => {
            (blockquote as HTMLQuoteElement).contentEditable = 'true';
        });
        Storage.setItem('blockquoteEditValue', '');

        const blockquoteId = target.id.slice(target.id.indexOf('r'), target.id.length);
        const rowId = blockquoteId.slice(blockquoteId.indexOf('w') + 1, blockquoteId.indexOf('c'));
        const colId = blockquoteId.slice(blockquoteId.indexOf('col') + 3, blockquoteId.length);

        let targetLogID = '';
        if (!target.innerHTML.startsWith('<')) {
            targetLogID = Storage.items.data[rowId]['LogID'];
        }
        const blockquote = document.querySelector(`#blockquote-${blockquoteId}`);

        blockquote?.addEventListener('focusout', () => {
            Storage.setItem('blockquoteEditValue', blockquote.textContent);

            const targetObject = Storage.items.staticData.find((obj: FullDataInterface) => obj['LogID'] === +targetLogID);
            const targetKey = Storage.items.objectKeysMap.get(`${colId}`);

            Storage.items.staticData[Storage.items.staticData.indexOf(targetObject)][targetKey] = Storage.items.blockquoteEditValue;

            delete Storage.items.blockquoteEditValue;
        });
    }

};
