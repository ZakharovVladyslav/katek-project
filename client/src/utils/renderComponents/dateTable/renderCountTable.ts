import CustomStorage, { ICustomStorage } from "../../../services/Storage/CustomStorage";

const countPFTable = document.querySelector('#countPF-table') as HTMLTableElement

const Storage: ICustomStorage = new CustomStorage();

export default function renderCountPFTable() {
    countPFTable.innerHTML = '';

    const header: HTMLTableSectionElement = document.createElement('thead');
    const body: HTMLTableSectionElement = document.createElement('tbody');

    const headers: string[] = ['CountPass', 'CountFail', 'CountPass_Retest', 'CountFail_Retest'];

    const headerRow = document.createElement('tr') as HTMLTableRowElement;

    headers.forEach((header: string) => {
        const headerCell = document.createElement('th') as HTMLTableCellElement;

        headerCell.innerHTML = header;

        headerRow.appendChild(headerCell);
    });

    header.appendChild(headerRow);

    for (let rowIndex = 0; rowIndex < Storage.items.limiter!; rowIndex++) {
        const bodyRow = document.createElement('tr') as HTMLTableRowElement;

        headers.forEach((header: string, columnIndex: number) => {
            const bodyRowCellHTML = `
                <td id="countPF-table-body-cell-row${rowIndex}-col${columnIndex}" class="countPF-table-body-cell">
                    ${Storage.items.data![rowIndex][header]}
                </td>
            `

            bodyRow.insertAdjacentHTML('beforeend', bodyRowCellHTML);
        })

        body.appendChild(bodyRow);
    }

    countPFTable.appendChild(header);
    countPFTable.appendChild(body);
}
