import CustomStorage, { ICustomStorage } from "../../../services/Storage/CustomStorage";

const Storage: ICustomStorage = new CustomStorage();

const tlogTable = document.querySelector('#tlog-table') as HTMLTableElement;

export default function rendertLogTable() {
    tlogTable.innerHTML = '';

    const header = document.createElement('thead') as HTMLTableSectionElement;
    const body = document.createElement('tbody') as HTMLTableSectionElement;

    const headers: string[] = ['tLogIn', 'tLogOut', 'tLastAcc'];

    const headerRow = document.createElement('tr') as HTMLTableRowElement;

    headers.forEach((header: string) => {
        const headerCell = document.createElement('th') as HTMLTableCellElement;

        headerCell.innerHTML = header;

        headerRow.appendChild(headerCell);
    })

    header.appendChild(headerRow);

    for (let rowIndex = 0; rowIndex < Storage.items.limiter!; rowIndex++ ) {
        const bodyRow = document.createElement('tr') as HTMLTableRowElement;

        headers.forEach((header: string, colIndex: number) => {
            const bodyRowHTML = `
                <td id="tlog-table-body-cell-row${rowIndex}-col${colIndex}">
                    ${Storage.items.data![rowIndex][header]}
                </td>
            `

            bodyRow.insertAdjacentHTML('beforeend', bodyRowHTML);
        })

        body.appendChild(bodyRow);
    }

    tlogTable.appendChild(header);
    tlogTable.appendChild(body);
}
