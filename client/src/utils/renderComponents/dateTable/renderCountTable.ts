import CustomStorage, { ICustomStorage } from "../../../services/Storage/CustomStorage";
import getDateDiffHours from "../../datesDifference";
import { FullDataInterface } from "../../types";

const countPFTable = document.querySelector('#countPF-table') as HTMLTableElement

const Storage: ICustomStorage = new CustomStorage();

export default function renderCountPFTable() {
    countPFTable.innerHTML = '';

    Storage.setItem('countPFCoeff', 1);

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
            const row: FullDataInterface = Storage.items.data![rowIndex];
            let coeff = 1;

            if (Storage.items.leftInnerDate && Storage.items.rightInnerDate)
                if (
                    Storage.items.data![rowIndex][header] !== null  &&
                    Storage.items.data![rowIndex].CountPass !== 0 &&
                    Storage.items.data![rowIndex].tLogOut !== 'NULL' &&
                    Storage.items.data![rowIndex].tLogIn !== 'NULL' &&
                    Storage.items.data![rowIndex].tLastAcc !== 'NULL'
                )
                    coeff = (getDateDiffHours(Storage.items.rightInnerDate, Storage.items.leftInnerDate)) / (getDateDiffHours(row.tLogIn, row.tLogOut));

            const bodyRowCellHTML = `
                <td id="countPF-table-body-cell-row${rowIndex}-col${columnIndex}" class="countPF-table-body-cell">
                    ${+Storage.items.data![rowIndex][header] * coeff}
                </td>
            `

            bodyRow.insertAdjacentHTML('beforeend', bodyRowCellHTML);
        })

        body.appendChild(bodyRow);
    }

    countPFTable.appendChild(header);
    countPFTable.appendChild(body);
}
