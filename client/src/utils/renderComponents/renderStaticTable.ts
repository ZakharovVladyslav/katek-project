import CustomStorage, { ICustomStorage } from "../../services/Storage/CustomStorage";

const staticTable = document.querySelector('#static-table') as HTMLTableElement;

const Storage: ICustomStorage = new CustomStorage();

export default function renderStaticTable() {
    staticTable.innerHTML = '';

    const columnNames = ['ProdCode', 'ProdName', 'Customer'];

    const staticTableHeader = document.createElement('thead');
    const staticTableBody = document.createElement('tbody');

    // Building static table column names (header row)

    const staticTableHeaderRow = document.createElement('tr');

    columnNames.forEach((header: string) => {
        const staticTableHeaderRowCellHTML = `
            <th>${header}</th>
        `

        staticTableHeaderRow.insertAdjacentHTML('beforeend', staticTableHeaderRowCellHTML);
    })

    staticTableHeader.appendChild(staticTableHeaderRow);

    // Building static table (data section)

    for (let i = 0; i < Storage.items.outputLimiter!; i++) {
        const staticTableBodyRow = document.createElement('tr');

        columnNames.forEach((header: string, columnIndex: number) => {
            const staticTableBodyRowCellHTML = `
                <td id="static-table-data-cell-${columnIndex}" class="static-table-data-cell">
                    ${Storage.items.data![i][header]}
                </td>
            `

            staticTableBodyRow.insertAdjacentHTML('beforeend', staticTableBodyRowCellHTML);
        })

        staticTableBody.appendChild(staticTableBodyRow);
    }

    staticTable.appendChild(staticTableHeader);
    staticTable.appendChild(staticTableBody);
}
