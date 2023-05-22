import CustomStorage from "./Storage/Local-Storage.js";

const Storage = new CustomStorage();

const callPopupBtn = document.querySelector('#call-popup');
const selectHeadersDiv = document.querySelector('#select-headers-div');
const headersTable = document.querySelector('#select-headers-table');
const tableWrapper = document.querySelector('#table-wrapper');

export default function PopUpHeadersSelect() {
    if (Storage.items.saveOption === 'Headers' || Storage.items.saveOption === 'Headers & Filters') {
        selectHeadersDiv.style.opacity = '1';
        callPopupBtn.disabled = false;
        headersTable.innerHTML = '';

        const headersTableBody = document.createElement('tbody');

        let allHeaders = [...Storage.items.allHeaders];
        let headers = [];
        let selectedHeaders = [];

        while (allHeaders.length > 0)
            headers.push(allHeaders.splice(0, 5));

        headers.forEach((row, rowIndex) => {
            const tableRow = document.createElement('tr');

            row.forEach((header, cellIndex) => {
                const tableCell = document.createElement('td');
                tableCell.innerHTML = header;

                let pos = headers[rowIndex][cellIndex];

                tableCell.classList.add('sqr')

                tableCell.addEventListener('click', () => {
                    selectedHeaders.indexOf(pos) === -1 ? selectedHeaders.push(pos) : selectedHeaders = selectedHeaders.filter(elem => elem !== pos)
                    tableCell.classList.toggle('selected')
                })
                tableCell.removeEventListener('click', () => {});

                tableRow.appendChild(tableCell);
            })

            headersTableBody.appendChild(tableRow);
        });

        headersTable.appendChild(headersTableBody);

        Storage.setItem('selectedHeaders', selectedHeaders);

        callPopupBtn.addEventListener('click', () => {
            console.log(tableWrapper);
            console.log(tableWrapper.classList);
            console.log(tableWrapper.classList.contains('show'));
            tableWrapper.classList.toggle('show');
        });
    }
    else {
        document.querySelector('#select-headers-div').style.opacity = '0';
        document.querySelector('#call-popup').disabled = true;
    }
}
