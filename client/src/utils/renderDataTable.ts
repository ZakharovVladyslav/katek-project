import CustomStorage, { ICustomStorage } from "../services/Storage/CustomStorage";

import handleTableClick from '../eventListeners/DataTableClick';

const Storage: ICustomStorage = new CustomStorage();

// DIVS--------------------------------------------------------------------------------------------
const overTables = document.querySelector('#over-tables') as HTMLDivElement;
//-------------------------------------------------------------------------------------------------

// INPUTS-------------------------------------------------------------------------------------------
const rowLimiter = document.querySelector('#row-limiter') as HTMLInputElement;
//-------------------------------------------------------------------------------------------------

// PARAGRAPHS--------------------------------------------------------------------------------------
const shownRowsCounter = document.querySelector('#shown-rows-counter') as HTMLParagraphElement;
//-------------------------------------------------------------------------------------------------

// TABLES------------------------------------------------------------------------------------------
const dataTable = document.querySelector('#data-table') as HTMLTableElement;
//-------------------------------------------------------------------------------------------------

export default function renderDataTable() {
    const thead: HTMLTableSectionElement = document.createElement('thead');
    const tbody: HTMLTableSectionElement = document.createElement('tbody');

    /**
     * Building a table from the data array which is object[]
     */
    if (dataTable) {
        dataTable.innerHTML = '';
        thead.innerHTML = '';
        tbody.innerHTML = '';
    }

    const innerTable = document.createElement('table');
    innerTable.innerHTML = '';

    dataTable.appendChild(thead);
    dataTable.appendChild(tbody);

    /**
    * Building a header row
    * hrow - header row, creates once as there is only 1 header row
    * theaderCell - 'th' html element that will contain header string
    * theaderCell.innerHTML will write header into 'th' html element as <th>header</th>
    */
    const hrow = document.createElement('tr');

    const headers: string[] = Storage.items.tableHeadersFromFile ?? Storage.items.tableHeaders!;

    headers.forEach((header: string) => {
        const theaderCell = document.createElement('th');

        theaderCell.innerHTML = header;

        hrow.appendChild(theaderCell);
    })
    thead.appendChild(hrow);

    /**
    * IF rowLimiter input field IS NOT empty, then outputLimiter will be checked:
    *    whether it is smaller than input data size or not:
    *       if yes: outputLimiter will be size of limiter value from input field
    *       if no: outputLimiter will be sized as input data array
    * ELSE if rowLimiter input field is empty, then outputLimiter will have size of the input array
    *
    */
    if (Storage.items.data) {
        if (rowLimiter && rowLimiter?.value !== '') {
            Storage.items.data.length > +rowLimiter?.value
                ? Storage.setItem('limiter', +rowLimiter?.value)
                : Storage.setItem('limiter', Storage.items.data.length);
        }
        else
            Storage.setItem('limiter', Storage.items.data.length);
    }

    if (Storage.items.limiter && Storage.items.limiter > 1000)
        Storage.setItem('limiter', 1000);

    if (shownRowsCounter)
        shownRowsCounter.innerHTML = `${Storage.items.limiter}`;

    /**
    * Building a table
    *
    * Number of rows is limited by the outputLimiter (described above)
    */

    if (dataTable.getAttribute('style') !== 'display: none;') {
        overTables.style.display = 'flex';

        for (let i = 0; i < Storage.items.limiter!; i++) {
            // body_row --- <tr> in <tbody> that contains info from object
            const body_row = document.createElement('tr');

            /**
         * Iterating through tableHeaders to print only headers that were specified
         */
            headers.forEach((header: string, j: number) => {
                let tableDataHTML = '';

                /**
             * Checks if value is NULL, then it hasn't to be printed
             */
                if (Storage.items.data![i][header] !== 'NULL') {
                    // If header is FPY then value has to be printed with % sign
                    // Here using blockquote to be able to change its value later

                    if (header === 'FPY') {
                        tableDataHTML = `
                <td id='cell-row${i}col${j}'>
                    <blockquote
                        contenteditable='false'
                        id='blockquote-row${i}col${j}'
                    >${Storage.items.data![i][header]}%</blockquote>
                </td>
                `;
                    }
                    else {
                        tableDataHTML = `
                <td id='cell-row${i}col${j}'>
                    <blockquote
                        contenteditable='false'
                        id='blockquote-row${i}col${j}'
                    >${Storage.items.data![i][header]}</blockquote>
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
                    >${Storage.items.data![i][header]}</blockquote>
                </td>
            `;
                }

                // Appending element to tbody row
                body_row.insertAdjacentHTML('beforeend', tableDataHTML);
            });
            tbody.appendChild(body_row);
        }

        dataTable.appendChild(thead);
        dataTable.appendChild(tbody);
    }

    /**
         * This event handler allows to work with table by clicking on the cell
         */

    dataTable?.addEventListener('click', handleTableClick);
}
